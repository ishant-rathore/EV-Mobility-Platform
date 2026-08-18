import type { Response, NextFunction } from "express";
import { AnalyticsService } from "./analytics.service.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class AnalyticsController {
  static async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await AnalyticsService.getAnalytics(req.user!.id, req.user!.roleName || "DRIVER");
      return sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  }
}
