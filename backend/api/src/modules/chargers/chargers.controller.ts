import type { Request, Response, NextFunction } from "express";
import { ChargerService } from "./chargers.service.js";
import { createChargerSchema, updateChargerSchema } from "./chargers.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class ChargerController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const stationId = req.query.stationId as string | undefined;
      const result = await ChargerService.list(stationId, page, limit);
      return sendSuccess(res, result.chargers, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const charger = await ChargerService.getById(req.params.id as string);
      return sendSuccess(res, charger);
    } catch (error) {
      next(error);
    }
  }

  static async listMine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await ChargerService.listMine(req.user!.id, req.user!.roleName === "ADMIN", page, limit);
      return sendSuccess(res, result.chargers, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createChargerSchema.parse(req.body);
      const isAdmin = req.user!.roleName === "ADMIN";
      const charger = await ChargerService.create(req.user!.id, isAdmin, input);
      return sendSuccess(res, charger, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateChargerSchema.parse(req.body);
      const isAdmin = req.user!.roleName === "ADMIN";
      const charger = await ChargerService.update(req.params.id as string, req.user!.id, isAdmin, input);
      return sendSuccess(res, charger);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.roleName === "ADMIN";
      const result = await ChargerService.delete(req.params.id as string, req.user!.id, isAdmin);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
