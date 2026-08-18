import type { Request, Response, NextFunction } from "express";
import { ParkingService } from "./parking.service.js";
import { createLocationSchema, updateLocationSchema, createBaySchema, updateBaySchema } from "./parking.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class ParkingController {
  static async listLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const result = await ParkingService.listLocations(page, limit);
      return sendSuccess(res, result.locations, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getLocationById(req: Request, res: Response, next: NextFunction) {
    try {
      const location = await ParkingService.getLocationById(req.params.id as string);
      return sendSuccess(res, location);
    } catch (error) {
      next(error);
    }
  }

  static async createLocation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createLocationSchema.parse(req.body);
      const location = await ParkingService.createLocation(req.user!.id, input);
      return sendSuccess(res, location, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateLocation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateLocationSchema.parse(req.body);
      const location = await ParkingService.updateLocation(req.params.id as string, input);
      return sendSuccess(res, location);
    } catch (error) {
      next(error);
    }
  }

  static async listBays(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
      const locationId = req.query.locationId as string | undefined;
      const result = await ParkingService.listBays(locationId, page, limit);
      return sendSuccess(res, result.bays, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async createBay(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createBaySchema.parse(req.body);
      const isAdmin = req.user!.roleName === "ADMIN";
      const bay = await ParkingService.createBay(req.user!.id, isAdmin, input);
      return sendSuccess(res, bay, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateBay(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = updateBaySchema.parse(req.body);
      const isAdmin = req.user!.roleName === "ADMIN";
      const bay = await ParkingService.updateBay(req.params.id as string, req.user!.id, isAdmin, input);
      return sendSuccess(res, bay);
    } catch (error) {
      next(error);
    }
  }
}
