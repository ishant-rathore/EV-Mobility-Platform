import type { Response, NextFunction } from "express";
import { UserService } from "./users.service.js";
import { updateMeSchema, updateUserSchema, updateUserStatusSchema } from "./users.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class UserController {
  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getMe(req.user!.id);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateMeSchema.parse(req.body);
      const user = await UserService.updateMe(req.user!.id, input);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await UserService.listUsers(page, limit);
      return sendSuccess(res, result.users, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateUserSchema.parse(req.body);
      const user = await UserService.updateUser(req.params.id as string, input);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateUserStatusSchema.parse(req.body);
      const user = await UserService.updateUserStatus(req.params.id as string, input.isActive);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }
}
