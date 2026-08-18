import { Router } from "express";
import { recommendationRequestSchema } from "./recommendation.schemas.js";
import { buildRecommendation } from "./recommendation.service.js";

export const recommendationRouter = Router();

recommendationRouter.post("/", async (request, response, next) => {
  try {
    const input = recommendationRequestSchema.parse(request.body);
    response.json(await buildRecommendation(input));
  } catch (error) {
    next(error);
  }
});
