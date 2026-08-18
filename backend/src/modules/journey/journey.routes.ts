import { Router } from "express";
import { integratedJourneyEvaluationSchema, journeyPlanSchema } from "./journey.schemas.js";
import { evaluateIntegratedJourney, planJourney } from "./journey.service.js";

export const journeyRouter = Router();

journeyRouter.post("/evaluate", async (request, response, next) => {
  try {
    response.json(
      await evaluateIntegratedJourney(integratedJourneyEvaluationSchema.parse(request.body)),
    );
  } catch (error) {
    next(error);
  }
});

journeyRouter.post("/plan", async (request, response, next) => {
  try {
    response.json(await planJourney(journeyPlanSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});
