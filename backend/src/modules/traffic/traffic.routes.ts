import { Router } from "express";
import { predictTraffic } from "./traffic-prediction.service.js";
import { trafficPredictionSchema } from "./traffic.schemas.js";

export const trafficRouter = Router();

trafficRouter.post("/predict", (request, response) => {
  response.json(predictTraffic(trafficPredictionSchema.parse(request.body)));
});
