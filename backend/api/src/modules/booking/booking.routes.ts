import { Router } from "express";
import { unlockDemoParkingAccess } from "../iot/access.service.js";
import { simulateReservationPayment } from "../payment/payment.service.js";
import {
  createReservationSchema,
  occupancyEventSchema,
  reservationQuerySchema,
  simulatedPaymentSchema,
} from "./booking.schemas.js";
import {
  createReservation,
  getReservation,
  listReservations,
  recordReservationOccupancy,
} from "./booking.service.js";

export const bookingRouter = Router();

bookingRouter.get("/", (request, response) => {
  const query = reservationQuerySchema.parse(request.query);
  response.json(listReservations(query.driverId));
});

bookingRouter.post("/", async (request, response, next) => {
  try {
    response.status(201).json(
      await createReservation(createReservationSchema.parse(request.body)),
    );
  } catch (error) {
    next(error);
  }
});

bookingRouter.post("/:id/payments/simulate", (request, response) => {
  response.json(
    simulateReservationPayment(
      request.params.id,
      simulatedPaymentSchema.parse(request.body),
    ),
  );
});

bookingRouter.post("/:id/access/unlock", (request, response) => {
  response.status(202).json(unlockDemoParkingAccess(request.params.id));
});

bookingRouter.post("/:id/occupancy", (request, response) => {
  const input = occupancyEventSchema.parse(request.body);
  response.status(202).json(recordReservationOccupancy(request.params.id, input.occupied));
});

bookingRouter.get("/:id", (request, response) => {
  response.json(getReservation(request.params.id));
});
