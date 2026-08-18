import type { Response, NextFunction } from "express";
import { PaymentService } from "./payments.service.js";
import { createPaymentSchema } from "./payments.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class PaymentController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const isAdmin = req.user!.roleName === "ADMIN";
      const result = await PaymentService.list(req.user!.id, isAdmin, page, limit);
      return sendSuccess(res, result.payments, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.roleName === "ADMIN";
      const payment = await PaymentService.getById(req.params.id as string, req.user!.id, isAdmin);
      return sendSuccess(res, payment);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createPaymentSchema.parse(req.body);
      const payment = await PaymentService.create(req.user!.id, input);
      return sendSuccess(res, payment, 201);
    } catch (error) {
      next(error);
    }
  }
}
