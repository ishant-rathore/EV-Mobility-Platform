import { Router } from "express";
import { z } from "zod";
import { evaluateRoute } from "./routing.service.js";

const energySchema = z.object({
  distanceKm: z.number().positive(),
  batteryCapacityKwh: z.number().positive(),
  efficiencyWhPerKm: z.number().positive(),
  currentSocPercent: z.number().min(0).max(100),
  reserveSocPercent: z.number().min(0).max(100).default(15),
});

export const routingRouter = Router();

routingRouter.post("/energy-estimate", (request, response) => {
  response.json(evaluateRoute(energySchema.parse(request.body)));
});
