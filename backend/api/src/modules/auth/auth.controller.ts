import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await AuthService.register(input);
      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await AuthService.login(input);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { message: "Logged out successfully." }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { user: req.user }, 200);
    } catch (error) {
      next(error);
    }
  }
}
