import { Router } from "express";
import { findChargingStations } from "./charging.service.js";
import { stationQuerySchema } from "./charging.schemas.js";

export const chargingRouter = Router();

chargingRouter.get("/", async (request, response, next) => {
  try {
    const query = stationQuerySchema.parse(request.query);
    response.json({ stations: await findChargingStations(query) });
  } catch (error) {
    next(error);
  }
});
