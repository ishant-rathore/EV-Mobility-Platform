import { Router } from "express";
import { integratedJourneyEvaluationSchema } from "../journey/journey.schemas.js";
import { evaluateIntegratedJourney } from "../journey/journey.service.js";
import { recommendationRequestSchema } from "./recommendation.schemas.js";
import { buildRecommendation } from "./recommendation.service.js";

export const recommendationRouter = Router();

recommendationRouter.post("/evaluate", async (request, response, next) => {
  try {
    const journey = await evaluateIntegratedJourney(
      integratedJourneyEvaluationSchema.parse(request.body),
    );
    response.json(journey.recommendation);
  } catch (error) {
    next(error);
  }
});

recommendationRouter.post("/", async (request, response, next) => {
  try {
    const input = recommendationRequestSchema.parse(request.body);
    const usePredictedTraffic = request.query.predictedTraffic === "true";
    response.json(await buildRecommendation(input, usePredictedTraffic));
  } catch (error) {
    next(error);
  }
});
