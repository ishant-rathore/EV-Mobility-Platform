import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";
import { userRouter } from "./users/users.routes.js";
import { vehicleRouter } from "./vehicles/vehicles.routes.js";
import { journeysRouter } from "./journeys/journeys.routes.js";
import { stationsRouter } from "./stations/stations.routes.js";
import { chargersRouter } from "./chargers/chargers.routes.js";
import { reservationsRouter } from "./reservations/reservations.routes.js";
import { parkingRouter } from "./parking/parking.routes.js";
import { paymentsRouter } from "./payments/payments.routes.js";
import { sessionsRouter } from "./sessions/sessions.routes.js";
import { iotRouter } from "./iot/iot.routes.js";
import { notificationsRouter } from "./notifications/notifications.routes.js";
import { analyticsRouter } from "./analytics/analytics.routes.js";

// Existing simulation / engine routers (preserved for backwards-compatibility)
import { chargingRouter } from "./charging/charging.routes.js";
import { bookingRouter } from "./booking/booking.routes.js";
import { evRouter } from "./ev/ev.routes.js";
import { journeyRouter } from "./journey/journey.routes.js";
import { recommendationRouter } from "./recommendation/recommendation.routes.js";
import { reliabilityRouter } from "./reliability/reliability.routes.js";
import { routingRouter } from "./routing/routing.routes.js";
import { telemetryRouter } from "./telemetry/telemetry.routes.js";
import { trafficRouter } from "./traffic/traffic.routes.js";
import { demoControlRouter } from "./admin/demo-control.routes.js";

export const apiRouter = Router();

// Core standard REST API foundation modules
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/journeys", journeysRouter);
apiRouter.use("/stations", stationsRouter);
apiRouter.use("/chargers", chargersRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/parking", parkingRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/iot", iotRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/analytics", analyticsRouter);

// Existing compatibility / simulator endpoints
apiRouter.use("/ev", evRouter);
apiRouter.use("/journey-eval", journeyRouter);
apiRouter.use("/routes", routingRouter);
apiRouter.use("/traffic", trafficRouter);
apiRouter.use("/charger-recommendations", chargingRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/recommendations", recommendationRouter);
apiRouter.use("/reliability", reliabilityRouter);
apiRouter.use("/telemetry", telemetryRouter);
apiRouter.use("/admin/demo", demoControlRouter);
