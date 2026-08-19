import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { sendError } from "../shared/response.js";
import { isInfrastructureOperatorPermission, isInfrastructureOperatorRole } from "../shared/roles.js";

const JWT_SECRET: Secret = (env.JWT_SECRET || "ev_mobility_jwt_secret_demo") as Secret;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId?: string | null;
    roleName?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, { code: "UNAUTHORIZED", message: "Authorization token required." }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendError(res, { code: "UNAUTHORIZED", message: "Invalid authorization header format." }, 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || !decoded.userId) {
      return sendError(res, { code: "UNAUTHORIZED", message: "Invalid or expired token." }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return sendError(res, { code: "UNAUTHORIZED", message: "User account inactive or not found." }, 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role?.name,
    };

    next();
  } catch (error) {
    return sendError(res, { code: "UNAUTHORIZED", message: "Token verification failed." }, 401);
  }
};


export const authorize = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.roleId) {
        return res.status(403).json({ error: "Forbidden: No assigned role" });
      }

      // Bypass for ADMIN if that logic exists, or just query exactly
      if (req.user.roleName === "ADMIN") {
        return next();
      }

      const [resource, action] = requiredPermission.split(":");

      // OPERATOR and PARKING_OPERATOR remain accepted aliases while accounts are
      // migrated to the unified INFRASTRUCTURE_OPERATOR role.
      if (
        resource &&
        action &&
        isInfrastructureOperatorRole(req.user.roleName) &&
        isInfrastructureOperatorPermission(resource, action)
      ) {
        return next();
      }

      const hasPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: req.user.roleId,
          permission: {
            resource,
            action
          }
        }
      });

      if (!hasPermission) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error during authorization" });
    }
  };
};
