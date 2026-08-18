import { Router } from "express";
import { recommendationRequestSchema } from "./recommendation.schemas.js";
import { buildRecommendation } from "./recommendation.service.js";

export const recommendationRouter = Router();

recommendationRouter.post("/", async (request, response, next) => {
  try {
    const input = recommendationRequestSchema.parse(request.body);
    const usePredictedTraffic = request.query.predictedTraffic === "true";
    response.json(await buildRecommendation(input, usePredictedTraffic));
  } catch (error) {
    next(error);
  }
});