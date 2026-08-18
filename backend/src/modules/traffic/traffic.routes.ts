import { Router } from "express";
import {
  predictTraffic,
  predictTrafficForRoute,
  getDemoRoutes,
  type PredictionMethod,
} from "./traffic-prediction.service.js";
import {
  trafficPredictionSchema,
  predictionMethodSchema,
  trafficRouteSchema,
  diversifyRoutesSchema,
  resetDemoSchema,
} from "./traffic.schemas.js";
import { diversifyRoutes } from "./diversification.service.js";
import { ZodError } from "zod";

export const trafficRouter = Router();

trafficRouter.get("/routes", (_request, response) => {
  const routes = getDemoRoutes();
  response.json(routes);
});

trafficRouter.post("/predict", (request, response) => {
  const input = trafficPredictionSchema.parse(request.body);
  const method = predictionMethodSchema.parse(request.query.method ?? "rule-based") as PredictionMethod;
  response.json(predictTraffic(input, method));
});

trafficRouter.post("/predict/route", (request, response) => {
  const route = trafficRouteSchema.parse(request.body);
  const method = predictionMethodSchema.parse(request.query.method ?? "rule-based") as PredictionMethod;
  const predictions = predictTrafficForRoute(route.segments, method);
  response.json({
    routeId: route.routeId,
    predictions,
    sourceMode: "DEMO",
  });
});

trafficRouter.post("/diversify", (request, response) => {
  try {
    const input = diversifyRoutesSchema.parse(request.body);
    const result = diversifyRoutes(input.routes, input.vehicleClass, input.projectedRequests);
    response.json({ routes: result });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.issues },
      });
      return;
    }
    throw error;
  }
});

trafficRouter.post("/reset-demo", (request, response) => {
  try {
    const input = resetDemoSchema.parse(request.body);
    response.json({ success: true, message: "Demo state reset", resetRoutes: input.routes });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.issues },
      });
      return;
    }
    throw error;
  }
});
