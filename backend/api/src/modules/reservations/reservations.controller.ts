import type { Response, NextFunction } from "express";
import { ReservationService } from "./reservations.service.js";
import { createReservationSchema } from "./reservations.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class ReservationController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await ReservationService.list(req.user!.id, req.user!.roleName || "DRIVER", page, limit);
      return sendSuccess(res, result.reservations, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.getById(req.params.id as string);
      return sendSuccess(res, reservation);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createReservationSchema.parse(req.body);
      const reservation = await ReservationService.create(req.user!.id, input);
      return sendSuccess(res, reservation, 201);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.cancel(req.params.id as string);
      return sendSuccess(res, reservation);
    } catch (error) {
      next(error);
    }
  }
}
