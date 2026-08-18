import { Router } from "express";
import { chargingRouter } from "./charging/charging.routes.js";
import { bookingRouter } from "./booking/booking.routes.js";
import { evRouter } from "./ev/ev.routes.js";
import { journeyRouter } from "./journey/journey.routes.js";
import { recommendationRouter } from "./recommendation/recommendation.routes.js";
import { parkingRouter } from "./parking/parking.routes.js";
import { reliabilityRouter } from "./reliability/reliability.routes.js";
import { routingRouter } from "./routing/routing.routes.js";
import { telemetryRouter } from "./telemetry/telemetry.routes.js";
import { trafficRouter } from "./traffic/traffic.routes.js";
import { demoControlRouter } from "./admin/demo-control.routes.js";

export const apiRouter = Router();

apiRouter.use("/ev", evRouter);
apiRouter.use("/journeys", journeyRouter);
apiRouter.use("/routes", routingRouter);
apiRouter.use("/traffic", trafficRouter);
apiRouter.use("/chargers", chargingRouter);
apiRouter.use("/reservations", bookingRouter);
apiRouter.use("/parking", parkingRouter);
apiRouter.use("/recommendations", recommendationRouter);
apiRouter.use("/reliability", reliabilityRouter);
apiRouter.use("/telemetry", telemetryRouter);
apiRouter.use("/admin/demo", demoControlRouter);
