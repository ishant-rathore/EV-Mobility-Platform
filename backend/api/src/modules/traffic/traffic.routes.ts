import { Router } from "express";
import {
  predictTraffic,
  predictTrafficForRoute,
  type PredictionMethod,
} from "./traffic-prediction.service.js";
import { getControlledDemoRoutes } from "./demo-traffic.service.js";
import {
  trafficPredictionSchema,
  predictionMethodSchema,
  trafficRouteSchema,
  diversifyRoutesSchema,
  diversificationSimulationSchema,
  resetDemoSchema,
} from "./traffic.schemas.js";
import {
  rankDiversificationRoutes,
  simulateDiversification,
  toDiversificationRouteInputs,
  trafficDiversificationEngine,
} from "./diversification.service.js";
import { ZodError } from "zod";

export const trafficRouter = Router();

trafficRouter.get("/routes", (_request, response) => {
  const routes = getControlledDemoRoutes();
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
    const routes = toDiversificationRouteInputs(input.routes);
    const projectedDemand = new Map(
      routes.map((route) => [route.trafficRouteId, input.projectedRequests]),
    );
    const decision = rankDiversificationRoutes({
      routes,
      vehicleClass: input.vehicleClass,
      projectedDemand,
      simulationId: "api-preview",
    });
    response.json({ routes: decision.candidates, decision });
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

trafficRouter.post("/diversify/simulate", (request, response) => {
  const input = diversificationSimulationSchema.parse(request.body);
  response.json(
    simulateDiversification({
      routes: toDiversificationRouteInputs(getControlledDemoRoutes()),
      vehicleClasses: input.vehicleClasses,
      requestCount: input.requestCount,
      demandUnitsPerRequest: input.demandUnitsPerRequest,
    }),
  );
});

trafficRouter.get("/diversify/state/:simulationId", (request, response) => {
  response.json({
    simulationId: request.params.simulationId,
    projectedDemand: Object.fromEntries(
      trafficDiversificationEngine.getProjectedDemand(request.params.simulationId),
    ),
    advisory: true,
  });
});

trafficRouter.post("/reset-demo", (request, response) => {
  try {
    const input = resetDemoSchema.parse(request.body);
    trafficDiversificationEngine.reset(input.simulationId);
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
