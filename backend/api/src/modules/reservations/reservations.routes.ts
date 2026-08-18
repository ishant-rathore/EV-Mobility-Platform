import { Router } from "express";
import { ReservationController } from "./reservations.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";

export const reservationsRouter = Router();

reservationsRouter.get("/", authenticate, authorize("reservation:read"), ReservationController.list);
reservationsRouter.post("/", authenticate, authorize("reservation:create"), ReservationController.create);
reservationsRouter.get("/:id", authenticate, authorize("reservation:read"), checkOwnership("reservation"), ReservationController.getById);
reservationsRouter.post("/:id/cancel", authenticate, authorize("reservation:cancel"), checkOwnership("reservation"), ReservationController.cancel);
