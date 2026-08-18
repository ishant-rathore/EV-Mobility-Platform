import { Router } from "express";
import { chargingRouter } from "./charging/charging.routes.js";
import { evRouter } from "./ev/ev.routes.js";
import { journeyRouter } from "./journey/journey.routes.js";
import { recommendationRouter } from "./recommendation/recommendation.routes.js";
import { routingRouter } from "./routing/routing.routes.js";
import { telemetryRouter } from "./telemetry/telemetry.routes.js";
import { trafficRouter } from "./traffic/traffic.routes.js";

export const apiRouter = Router();

apiRouter.use("/ev", evRouter);
apiRouter.use("/journeys", journeyRouter);
apiRouter.use("/routes", routingRouter);
apiRouter.use("/traffic", trafficRouter);
apiRouter.use("/chargers", chargingRouter);
apiRouter.use("/recommendations", recommendationRouter);
apiRouter.use("/telemetry", telemetryRouter);
