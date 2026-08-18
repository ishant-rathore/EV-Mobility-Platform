import { Router } from "express";
import { journeyPlanSchema } from "./journey.schemas.js";
import { planJourney } from "./journey.service.js";

export const journeyRouter = Router();

journeyRouter.post("/plan", async (request, response, next) => {
  try {
    response.json(await planJourney(journeyPlanSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});
