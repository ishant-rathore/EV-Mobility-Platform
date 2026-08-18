import { Router } from "express";
import { energyEstimateSchema, routeEvaluationSchema } from "./routing.schemas.js";
import { evaluateCandidateRoutes, evaluateRoute, evaluateRoutes } from "./routing.service.js";

export const routingRouter = Router();

routingRouter.post("/energy-estimate", (request, response) => {
  response.json(evaluateRoute(energyEstimateSchema.parse(request.body)));
});

routingRouter.post("/evaluate", async (request, response, next) => {
  try {
    response.json(await evaluateCandidateRoutes(routeEvaluationSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

routingRouter.post("/evaluate-predicted", async (request, response, next) => {
  try {
    const input = routeEvaluationSchema.parse(request.body);
    response.json(evaluateRoutes(input, true));
  } catch (error) {
    next(error);
  }
<<<<<<< HEAD
});
=======
});
>>>>>>> 9910318 (feat: update EV mobility platform RBAC and backend foundation)
