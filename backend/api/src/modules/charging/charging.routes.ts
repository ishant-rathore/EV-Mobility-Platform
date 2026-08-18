import { Router } from "express";
import { AppError } from "../../shared/errors.js";
import { findChargingStations, getChargerDetail, recommendChargingCandidates } from "./charging.service.js";
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

chargingRouter.get("/:chargerId", async (request, response, next) => {
  try {
    const detail = await getChargerDetail(request.params.chargerId);
    if (!detail) {
      throw new AppError("Charger not found", 404, "CHARGER_NOT_FOUND");
    }
    response.json(detail);
  } catch (error) {
    next(error);
  }
});
