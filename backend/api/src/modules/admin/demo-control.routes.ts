import { Router } from "express";
import {
  demoBatchSchema,
  demoChargerActionSchema,
  demoFreezeSchema,
  demoModeSchema,
  demoResetSchema,
  demoTrafficSchema,
} from "./demo-control.schemas.js";
import {
  changeDemoFreeze,
  changeDemoMode,
  changeDemoTraffic,
  getDemoControlSnapshot,
  resetAllDemoState,
  runDemoVehicleBatch,
  triggerDemoCharger,
} from "./demo-control.service.js";

export const demoControlRouter = Router();

demoControlRouter.get("/", (_request, response) => {
  response.json(getDemoControlSnapshot());
});

demoControlRouter.post("/mode", (request, response) => {
  const input = demoModeSchema.parse(request.body);
  response.json(changeDemoMode(input.mode));
});

demoControlRouter.post("/freeze", (request, response) => {
  const input = demoFreezeSchema.parse(request.body);
  response.json(changeDemoFreeze(input.frozen));
});

demoControlRouter.post("/traffic", (request, response) => {
  const input = demoTrafficSchema.parse(request.body);
  response.json(changeDemoTraffic(input.routeId, input.level));
});

demoControlRouter.post("/charger", (request, response) => {
  const input = demoChargerActionSchema.parse(request.body);
  response.json(triggerDemoCharger(input.chargerId, input.action));
});

demoControlRouter.post("/vehicle-batch", (request, response) => {
  const input = demoBatchSchema.parse(request.body);
  response.json(runDemoVehicleBatch(input));
});

demoControlRouter.post("/reset", (request, response) => {
  demoResetSchema.parse(request.body);
  response.json(resetAllDemoState());
});
