import { Router } from "express";
import { ChargerController } from "./chargers.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const chargersRouter = Router();

chargersRouter.get("/", ChargerController.list);
chargersRouter.get("/:id", ChargerController.getById);

chargersRouter.post("/", authenticate, authorize("charger:create"), ChargerController.create);
chargersRouter.patch("/:id", authenticate, authorize("charger:update"), ChargerController.update);
chargersRouter.delete("/:id", authenticate, authorize("charger:manage"), ChargerController.delete);
