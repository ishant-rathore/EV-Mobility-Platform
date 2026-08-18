import { Router } from "express";
import { AppError } from "../../shared/errors.js";
import {
  createVehicleSchema,
  evProfilePreviewSchema,
  updateSocSchema,
} from "./ev.schemas.js";
import { summarizeEvProfile } from "./ev.service.js";
import { evRepository, toEvProfileSummary } from "./ev.store.js";

export const evRouter = Router();

evRouter.get("/vehicles", async (_request, response) => {
  const vehicles = await evRepository.list();
  response.json(vehicles.map(toEvProfileSummary));
});

evRouter.get("/vehicles/:id", async (request, response) => {
  const vehicle = await evRepository.findById(request.params.id);
  if (!vehicle) {
    throw new AppError(`No EV vehicle found with id "${request.params.id}".`, 404, "EV_VEHICLE_NOT_FOUND");
  }
  response.json(toEvProfileSummary(vehicle));
});

evRouter.post("/vehicles", async (request, response) => {
  const input = createVehicleSchema.parse(request.body);
  const vehicle = await evRepository.create(input);
  response.status(201).json(toEvProfileSummary(vehicle));
});

evRouter.patch("/vehicles/:id/soc", async (request, response) => {
  const { currentSocPercent } = updateSocSchema.parse(request.body);
  const vehicle = await evRepository.updateSoc(request.params.id, currentSocPercent);
  if (!vehicle) {
    throw new AppError(`No EV vehicle found with id "${request.params.id}".`, 404, "EV_VEHICLE_NOT_FOUND");
  }
  response.json(toEvProfileSummary(vehicle));
});

// Stateless calculator — nothing persisted, used by the planner before a vehicle is saved.
evRouter.post("/profiles/preview", (request, response) => {
  response.json(summarizeEvProfile(evProfilePreviewSchema.parse(request.body)));
});
