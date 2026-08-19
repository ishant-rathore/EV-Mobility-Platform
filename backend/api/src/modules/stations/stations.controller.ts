import type { Request, Response, NextFunction } from "express";
import { StationService } from "./stations.service.js";
import { createStationSchema, updateStationSchema } from "./stations.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class StationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await StationService.list(page, limit);
      return sendSuccess(res, result.stations, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const station = await StationService.getById(req.params.id as string);
      return sendSuccess(res, station);
    } catch (error) {
      next(error);
    }
  }

  static async listMine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await StationService.listMine(req.user!.id, req.user!.roleName === "ADMIN", page, limit);
      return sendSuccess(res, result.stations, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createStationSchema.parse(req.body);
      const station = await StationService.create(req.user!.id, input);
      return sendSuccess(res, station, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateStationSchema.parse(req.body);
      const station = await StationService.update(req.params.id as string, input);
      return sendSuccess(res, station);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await StationService.delete(req.params.id as string);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
