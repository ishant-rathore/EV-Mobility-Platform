import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetAccessCommandStore } from "../iot/access.service.js";
import { resetOccupancyStore } from "../occupancy/occupancy.service.js";
import { resetPaymentStore } from "../payment/payment.service.js";
import { resetRecommendationStore } from "../recommendation/recommendation.store.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";
import { resetReservationStore } from "./booking.service.js";

const recommendationRequest = {
  vehicleId: "vehicle-nexon-demo",
  currentSocPercent: 20,
  origin: { label: "Mumbai Central", latitude: 18.969, longitude: 72.8194 },
  destination: { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
  auxiliaryLoadKwh: 0.4,
  provider: "DEMO",
  trafficHorizon: "PREDICTED",
  diversificationSimulationId: "module-nine-test",
};

function reservationWindow() {
  const now = Date.now();
  return {
    startsAt: new Date(now - 60_000).toISOString(),
    endsAt: new Date(now + 60 * 60_000).toISOString(),
  };
}

async function issueRecommendation() {
  const response = await request(app)
    .post("/api/v1/recommendations/evaluate")
    .send(recommendationRequest);
  expect(response.status).toBe(200);
  expect(response.body.status).toBe("READY");
  return response.body as { recommendationId: string; recommendedChargerId: string };
}

describe("Module 09 reservation, payment, parking, and access", () => {
  beforeEach(() => {
    resetAccessCommandStore();
    resetOccupancyStore();
    resetPaymentStore();
    resetRecommendationStore();
    resetReliabilityStore();
    resetReservationStore();
  });

  it("completes the simulated recommendation-to-access golden path", async () => {
    const recommendation = await issueRecommendation();
    const created = await request(app)
      .post("/api/v1/reservations")
      .send({
        recommendationId: recommendation.recommendationId,
        driverId: "driver-demo",
        vehicleId: "vehicle-nexon-demo",
        ...reservationWindow(),
        assignParkingBay: true,
        paymentRequired: true,
      });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      chargerId: recommendation.recommendedChargerId,
      parkingBayId: expect.any(String),
      status: "PENDING_PAYMENT",
      paymentStatus: "PENDING",
      sourceMode: "DEMO",
      isSimulated: true,
    });

    const paymentBody = {
      idempotencyKey: "module-nine-payment-001",
      amount: 250,
      currency: "INR",
      outcome: "APPROVED",
    };
    const payment = await request(app)
      .post(`/api/v1/reservations/${created.body.id}/payments/simulate`)
      .send(paymentBody);
    const repeatedPayment = await request(app)
      .post(`/api/v1/reservations/${created.body.id}/payments/simulate`)
      .send(paymentBody);
    expect(payment.status).toBe(200);
    expect(payment.body).toMatchObject({
      status: "APPROVED",
      provider: "DEMO_PAYMENT",
      isSimulated: true,
    });
    expect(repeatedPayment.body.id).toBe(payment.body.id);

    const access = await request(app)
      .post(`/api/v1/reservations/${created.body.id}/access/unlock`)
      .send({});
    expect(access.status).toBe(202);
    expect(access.body).toMatchObject({
      command: "UNLOCK_DEMO_FLAP",
      status: "ACKNOWLEDGED",
      sourceMode: "SIMULATOR",
      isSimulated: true,
    });

    const occupancy = await request(app)
      .post(`/api/v1/reservations/${created.body.id}/occupancy`)
      .send({ occupied: true });
    expect(occupancy.status).toBe(202);
    expect(occupancy.body).toMatchObject({
      event: { occupied: true, sourceMode: "SIMULATOR", isSimulated: true },
      reservation: { status: "ACTIVE" },
    });

    const finalReservation = await request(app).get(`/api/v1/reservations/${created.body.id}`);
    expect(finalReservation.body).toMatchObject({
      status: "ACTIVE",
      paymentStatus: "APPROVED",
    });
  });

  it("prevents overlapping reservations for the recommended charger", async () => {
    const recommendation = await issueRecommendation();
    const payload = {
      recommendationId: recommendation.recommendationId,
      driverId: "driver-demo",
      vehicleId: "vehicle-nexon-demo",
      ...reservationWindow(),
    };
    const first = await request(app).post("/api/v1/reservations").send(payload);
    const conflicting = await request(app).post("/api/v1/reservations").send(payload);

    expect(first.status).toBe(201);
    expect(conflicting.status).toBe(409);
    expect(conflicting.body.error.code).toBe("RESERVATION_CONFLICT");
  });

  it("rejects client attempts to replace the server-recommended charger", async () => {
    const recommendation = await issueRecommendation();
    const response = await request(app)
      .post("/api/v1/reservations")
      .send({
        recommendationId: recommendation.recommendationId,
        driverId: "driver-demo",
        vehicleId: "vehicle-nexon-demo",
        chargerId: "forged-charger",
        ...reservationWindow(),
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects payment-card fields instead of collecting or storing them", async () => {
    const recommendation = await issueRecommendation();
    const created = await request(app)
      .post("/api/v1/reservations")
      .send({
        recommendationId: recommendation.recommendationId,
        driverId: "driver-demo",
        vehicleId: "vehicle-nexon-demo",
        ...reservationWindow(),
        paymentRequired: true,
      });
    const response = await request(app)
      .post(`/api/v1/reservations/${created.body.id}/payments/simulate`)
      .send({
        idempotencyKey: "module-nine-payment-card-rejection",
        amount: 250,
        currency: "INR",
        outcome: "APPROVED",
        cardNumber: "4111111111111111",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
