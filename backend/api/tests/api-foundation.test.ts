import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("EV Mobility Platform - Backend API Foundation & Authorization Tests", () => {
  let driverToken: string;
  let operatorToken: string;
  let parkingOpToken: string;
  let adminToken: string;

  let driverId: string;
  let operatorId: string;
  let parkingOpId: string;
  let adminId: string;

  let testVehicleId: string;
  let testJourneyId: string;
  let testStationId: string;
  let testChargerId: string;
  let testLocationId: string;
  let testBayId: string;
  let testDeviceId: string;
  let testReservationId: string;

  beforeAll(async () => {
    // 1. Authenticate demo users seeded in database
    const driverLogin = await request(app).post("/api/v1/auth/login").send({
      email: "driver@example.com",
      password: "password123",
    });
    driverToken = driverLogin.body.data.token;
    driverId = driverLogin.body.data.user.id;

    const opLogin = await request(app).post("/api/v1/auth/login").send({
      email: "operator@example.com",
      password: "password123",
    });
    operatorToken = opLogin.body.data.token;
    operatorId = opLogin.body.data.user.id;

    const parkingLogin = await request(app).post("/api/v1/auth/login").send({
      email: "parking@example.com",
      password: "password123",
    });
    parkingOpToken = parkingLogin.body.data.token;
    parkingOpId = parkingLogin.body.data.user.id;

    const adminLogin = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = adminLogin.body.data.token;
    adminId = adminLogin.body.data.user.id;
  });

  describe("1. Health Endpoints", () => {
    it("GET /health -> 200", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });

    it("GET /api/v1/health -> 200 (versioned with envelope)", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("ok");
      expect(res.headers["x-request-id"]).toBeDefined();
    });

    it("GET /api/v1/health/ready -> 200", async () => {
      const res = await request(app).get("/api/v1/health/ready");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("2. Auth Endpoints", () => {
    it("POST /api/v1/auth/register -> 201 creates new driver", async () => {
      const testEmail = `newdriver_${Date.now()}@example.com`;
      const res = await request(app).post("/api/v1/auth/register").send({
        email: testEmail,
        name: "Test Driver",
        password: "securepassword123",
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.token).toBeDefined();
    });

    it("POST /api/v1/auth/login -> 200 returns token", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "driver@example.com",
        password: "password123",
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("POST /api/v1/auth/login -> 401 on invalid login", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "driver@example.com",
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("AUTHENTICATION_FAILED");
    });

    it("GET /api/v1/auth/me -> 401 without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("GET /api/v1/auth/me -> 200 with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("driver@example.com");
    });
  });

  describe("3. Vehicles Endpoints & Ownership", () => {
    it("POST /api/v1/vehicles -> 201 creates own vehicle", async () => {
      const res = await request(app)
        .post("/api/v1/vehicles")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          name: "Tata Nexon EV",
          vehicleClass: "CAR",
          connectorTypes: ["CCS2"],
          batteryCapacityKwh: 40.5,
          batteryHealthPercent: 100,
          efficiencyWhPerKm: 140,
          currentSocPercent: 80,
          reserveSocPercent: 10,
          isDefault: true,
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Tata Nexon EV");
      testVehicleId = res.body.data.id;
    });

    it("GET /api/v1/vehicles/:id -> 200 owner can get own vehicle", async () => {
      const res = await request(app)
        .get(`/api/v1/vehicles/${testVehicleId}`)
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testVehicleId);
    });

    it("GET /api/v1/vehicles/:id -> 403 another user cannot access vehicle (IDOR protection)", async () => {
      const res = await request(app)
        .get(`/api/v1/vehicles/${testVehicleId}`)
        .set("Authorization", `Bearer ${operatorToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("4. Journeys Endpoints & Ownership", () => {
    it("POST /api/v1/journeys/plan -> 201 creates journey", async () => {
      const res = await request(app)
        .post("/api/v1/journeys/plan")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          vehicleId: testVehicleId,
          originLabel: "Mumbai Central",
          destinationLabel: "Pune Swargate",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.originLabel).toBe("Mumbai Central");
      testJourneyId = res.body.data.id;
    });

    it("GET /api/v1/journeys/:id -> 200 owner gets journey", async () => {
      const res = await request(app)
        .get(`/api/v1/journeys/${testJourneyId}`)
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testJourneyId);
    });

    it("GET /api/v1/journeys/:id -> 403 non-owner gets 403 forbidden", async () => {
      const res = await request(app)
        .get(`/api/v1/journeys/${testJourneyId}`)
        .set("Authorization", `Bearer ${operatorToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("5. Stations & Chargers Endpoints", () => {
    it("POST /api/v1/stations -> 201 operator creates station", async () => {
      const res = await request(app)
        .post("/api/v1/stations")
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({
          name: "Express Highway EV Station",
          latitude: 19.012,
          longitude: 72.845,
          address: "Navi Mumbai Expressway",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      testStationId = res.body.data.id;
    });

    it("PATCH /api/v1/stations/:id -> 200 operator updates own station", async () => {
      const res = await request(app)
        .patch(`/api/v1/stations/${testStationId}`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ name: "Express Highway EV Station (Updated)" });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Express Highway EV Station (Updated)");
    });

    it("PATCH /api/v1/stations/:id -> 403 unauthorized driver cannot update station", async () => {
      const res = await request(app)
        .patch(`/api/v1/stations/${testStationId}`)
        .set("Authorization", `Bearer ${driverToken}`)
        .send({ name: "Hacked Station" });
      expect(res.status).toBe(403);
    });

    it("POST /api/v1/chargers -> 201 operator creates charger for own station", async () => {
      const res = await request(app)
        .post("/api/v1/chargers")
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({
          stationId: testStationId,
          connectorType: "CCS2",
          maximumPowerKw: 120,
          status: "AVAILABLE",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      testChargerId = res.body.data.id;
    });
  });

  describe("6. Parking & IoT Endpoints", () => {
    it("POST /api/v1/parking/locations -> 201 parking operator creates location", async () => {
      const res = await request(app)
        .post("/api/v1/parking/locations")
        .set("Authorization", `Bearer ${parkingOpToken}`)
        .send({
          name: "Central Mall Smart Parking",
          latitude: 19.076,
          longitude: 72.877,
        });
      expect(res.status).toBe(201);
      testLocationId = res.body.data.id;
    });

    it("POST /api/v1/parking/bays -> 201 parking operator creates bay", async () => {
      const res = await request(app)
        .post("/api/v1/parking/bays")
        .set("Authorization", `Bearer ${parkingOpToken}`)
        .send({
          locationId: testLocationId,
          label: "BAY-01",
          isEvEnabled: true,
        });
      expect(res.status).toBe(201);
      testBayId = res.body.data.id;

      // Seed an IoT device for this slot
      const device = await prisma.ioTDevice.create({
        data: {
          parkingSlotId: testBayId,
          externalId: `esp32_slot_${Date.now()}`,
        },
      });
      testDeviceId = device.id;
    });

    it("PATCH /api/v1/parking/locations/:id -> 403 unauthorized driver cannot update parking location", async () => {
      const res = await request(app)
        .patch(`/api/v1/parking/locations/${testLocationId}`)
        .set("Authorization", `Bearer ${driverToken}`)
        .send({ name: "Unauthorized Edit" });
      expect(res.status).toBe(403);
    });
  });

  describe("7. Reservations & Conflict Checking", () => {
    const startsAt = new Date(Date.now() + 3600 * 1000).toISOString();
    const endsAt = new Date(Date.now() + 7200 * 1000).toISOString();

    it("POST /api/v1/reservations -> 201 driver creates reservation", async () => {
      const res = await request(app)
        .post("/api/v1/reservations")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          parkingSlotId: testBayId,
          startsAt,
          endsAt,
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      testReservationId = res.body.data.id;
    });

    it("GET /api/v1/reservations/:id -> 200 driver reads own reservation", async () => {
      const res = await request(app)
        .get(`/api/v1/reservations/${testReservationId}`)
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testReservationId);
    });

    it("GET /api/v1/reservations/:id -> 403 other driver cannot read reservation", async () => {
      const res = await request(app)
        .get(`/api/v1/reservations/${testReservationId}`)
        .set("Authorization", `Bearer ${operatorToken}`);
      expect(res.status).toBe(403);
    });

    it("POST /api/v1/reservations -> 409 conflicting reservation rejected", async () => {
      const res = await request(app)
        .post("/api/v1/reservations")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          parkingSlotId: testBayId,
          startsAt,
          endsAt,
        });
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("RESERVATION_CONFLICT");
    });
  });

  describe("8. Payments & Sessions", () => {
    it("POST /api/v1/payments/create -> 201 driver completes payment", async () => {
      const res = await request(app)
        .post("/api/v1/payments/create")
        .set("Authorization", `Bearer ${driverToken}`)
        .send({
          bookingId: testReservationId,
          amount: 250,
          currency: "INR",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("COMPLETED");
    });

    it("GET /api/v1/payments -> 200 lists payments for user", async () => {
      const res = await request(app)
        .get("/api/v1/payments")
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("9. IoT Device Control & Access", () => {
    it("POST /api/v1/iot/devices/:id/unlock -> 200 authorized parking operator can unlock", async () => {
      const res = await request(app)
        .post(`/api/v1/iot/devices/${testDeviceId}/unlock`)
        .set("Authorization", `Bearer ${parkingOpToken}`)
        .send({});
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.command).toBe("UNLOCK");
    });

    it("POST /api/v1/iot/devices/:id/unlock -> 403 unauthorized user cannot unlock arbitrary device", async () => {
      const res = await request(app)
        .post(`/api/v1/iot/devices/${testDeviceId}/unlock`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN_DEVICE_ACCESS");
    });
  });

  describe("10. Analytics & Admin Endpoints", () => {
    it("GET /api/v1/analytics -> 200 returns role-scoped analytics", async () => {
      const res = await request(app)
        .get("/api/v1/analytics")
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.scope).toBe("DRIVER");
    });

    it("GET /api/v1/users -> 200 admin can access admin user management", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("GET /api/v1/users -> 403 driver is rejected from admin endpoint", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${driverToken}`);
      expect(res.status).toBe(403);
    });
  });
});
