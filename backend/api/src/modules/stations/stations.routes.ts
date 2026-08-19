import { Router } from "express";
import { StationController } from "./stations.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";

export const stationsRouter = Router();

stationsRouter.get("/", StationController.list);
stationsRouter.get("/mine", authenticate, authorize("station:read"), StationController.listMine);
stationsRouter.get("/:id", StationController.getById);

stationsRouter.post("/", authenticate, authorize("station:create"), StationController.create);
stationsRouter.patch("/:id", authenticate, authorize("station:update"), checkOwnership("charging_station"), StationController.update);
stationsRouter.delete("/:id", authenticate, authorize("station:delete"), checkOwnership("charging_station"), StationController.delete);
