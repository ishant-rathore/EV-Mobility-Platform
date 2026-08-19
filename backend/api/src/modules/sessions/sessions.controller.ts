import type { Response, NextFunction } from "express";
import { SessionService } from "./sessions.service.js";
import { startSessionSchema, stopSessionSchema } from "./sessions.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class SessionController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await SessionService.list(req.user!.id, req.user!.roleName || "DRIVER", page, limit);
      return sendSuccess(res, result.sessions, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const session = await SessionService.getById(req.params.id as string, req.user!.id, req.user!.roleName || "DRIVER");
      return sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  static async start(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = startSessionSchema.parse(req.body);
      const session = await SessionService.start(req.user!.id, input);
      return sendSuccess(res, session, 201);
    } catch (error) {
      next(error);
    }
  }

  static async stop(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = stopSessionSchema.parse(req.body);
      const session = await SessionService.stop(req.params.id as string, req.user!.id, req.user!.roleName || "DRIVER", input);
      return sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }
}
