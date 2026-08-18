import { Router } from "express";
import { JourneysController } from "./journeys.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";

export const journeysRouter = Router();

journeysRouter.get("/", authenticate, authorize("journey:read"), JourneysController.list);
journeysRouter.post("/plan", authenticate, authorize("journey:create"), JourneysController.plan);
journeysRouter.get("/:id", authenticate, authorize("journey:read"), checkOwnership("journey"), JourneysController.getById);
journeysRouter.post("/:id/cancel", authenticate, authorize("journey:cancel"), checkOwnership("journey"), JourneysController.cancel);
