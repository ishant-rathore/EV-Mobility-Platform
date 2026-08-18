import { Router } from "express";
import { VehicleController } from "./vehicles.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";

export const vehicleRouter = Router();

vehicleRouter.get("/", authenticate, authorize("vehicle:read"), VehicleController.list);
vehicleRouter.post("/", authenticate, authorize("vehicle:create"), VehicleController.create);
vehicleRouter.get("/:id", authenticate, authorize("vehicle:read"), checkOwnership("vehicle"), VehicleController.getById);
vehicleRouter.patch("/:id", authenticate, authorize("vehicle:update"), checkOwnership("vehicle"), VehicleController.update);
vehicleRouter.delete("/:id", authenticate, authorize("vehicle:delete"), checkOwnership("vehicle"), VehicleController.delete);
