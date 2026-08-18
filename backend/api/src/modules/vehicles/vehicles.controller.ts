import type { Response, NextFunction } from "express";
import { VehicleService } from "./vehicles.service.js";
import { createVehicleSchema, updateVehicleSchema } from "./vehicles.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class VehicleController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const isAdmin = req.user!.roleName === "ADMIN";
      const result = await VehicleService.listVehicles(req.user!.id, isAdmin, page, limit);
      return sendSuccess(res, result.vehicles, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id as string);
      return sendSuccess(res, vehicle);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createVehicleSchema.parse(req.body);
      const vehicle = await VehicleService.createVehicle(req.user!.id, input);
      return sendSuccess(res, vehicle, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateVehicleSchema.parse(req.body);
      const vehicle = await VehicleService.updateVehicle(req.params.id as string, input);
      return sendSuccess(res, vehicle);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await VehicleService.deleteVehicle(req.params.id as string);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
