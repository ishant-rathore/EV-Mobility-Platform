import type { Response, NextFunction } from "express";
import { NotificationService } from "./notifications.service.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class NotificationController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const list = await NotificationService.list(req.user!.id);
      return sendSuccess(res, list);
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.markRead(req.params.id as string, req.user!.id);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
