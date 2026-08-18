import type { Request, Response, NextFunction } from "express";
import { IoTDeviceService } from "./iot.service.js";
import { deviceCommandSchema } from "./iot.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class IoTController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
      const result = await IoTDeviceService.listDevices(page, limit);
      return sendSuccess(res, result.devices, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async unlock(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = deviceCommandSchema.parse(req.body);
      const result = await IoTDeviceService.sendCommand(
        req.params.id as string,
        "UNLOCK",
        req.user!.id,
        req.user!.roleName || "DRIVER",
        input.reservationId
      );
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async lock(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = deviceCommandSchema.parse(req.body);
      const result = await IoTDeviceService.sendCommand(
        req.params.id as string,
        "LOCK",
        req.user!.id,
        req.user!.roleName || "DRIVER",
        input.reservationId
      );
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
