import { Router } from "express";
import { IoTController } from "./iot.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const iotRouter = Router();

iotRouter.get("/devices", authenticate, authorize("iot:read"), IoTController.list);
iotRouter.post("/devices/:id/unlock", authenticate, authorize("iot:unlock"), IoTController.unlock);
iotRouter.post("/devices/:id/lock", authenticate, authorize("iot:lock"), IoTController.lock);
