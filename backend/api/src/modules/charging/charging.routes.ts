import { Router } from "express";
import { findChargingStations, recommendChargingCandidates } from "./charging.service.js";
import { chargingRecommendationSchema, stationQuerySchema } from "./charging.schemas.js";

export const chargingRouter = Router();

chargingRouter.post("/recommendations", async (request, response, next) => {
  try {
    const input = chargingRecommendationSchema.parse(request.body);
    response.json(await recommendChargingCandidates(input));
  } catch (error) {
    next(error);
  }
});

chargingRouter.get("/", async (request, response, next) => {
  try {
    const query = stationQuerySchema.parse(request.query);
    response.json({ stations: await findChargingStations(query) });
  } catch (error) {
    next(error);
  }
});
