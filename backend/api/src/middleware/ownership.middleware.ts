import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { prisma } from "../lib/prisma.js";

export const checkOwnership = (
  resourceType: "vehicle" | "journey" | "reservation" | "charging_station" | "parking_location" | "iot_device"
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Authentication required." },
        });
      }

      if (req.user.roleName === "ADMIN") {
        return next();
      }

      const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!resourceId) {
        return next();
      }

      let isOwner = false;

      switch (resourceType) {
        case "vehicle": {
          const vehicle = await prisma.eVVehicle.findUnique({ where: { id: resourceId } });
          if (vehicle && vehicle.userId === req.user.id) isOwner = true;
          break;
        }
        case "journey": {
          const journey = await prisma.journey.findUnique({ where: { id: resourceId } });
          if (journey && journey.userId === req.user.id) isOwner = true;
          break;
        }
        case "reservation": {
          const booking = await prisma.booking.findUnique({ where: { id: resourceId } });
          if (booking && booking.userId === req.user.id) isOwner = true;
          break;
        }
        case "charging_station": {
          const station = await prisma.chargingStation.findUnique({ where: { id: resourceId } });
          if (station && station.operatorId === req.user.id) isOwner = true;
          break;
        }
        case "parking_location": {
          const parking = await prisma.parkingLocation.findUnique({ where: { id: resourceId } });
          if (parking && parking.operatorId === req.user.id) isOwner = true;
          break;
        }
        case "iot_device": {
          const device = await prisma.ioTDevice.findUnique({
            where: { id: resourceId },
            include: { parkingSlot: { include: { location: true } } },
          });
          if (device?.parkingSlot?.location?.operatorId === req.user.id) isOwner = true;
          break;
        }
        default:
          return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: "Invalid resource type for ownership check." },
          });
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Forbidden: You do not own or manage this resource." },
        });
      }

      next();
    } catch (error) {
      console.error("Ownership Check Error:", error);
      return res.status(500).json({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Internal server error during ownership check." },
      });
    }
  };
};

