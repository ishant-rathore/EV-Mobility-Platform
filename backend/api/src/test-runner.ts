import request from "supertest";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

async function seedDatabaseIfEmpty() {
  console.log("Ensuring database roles and demo accounts are present...");
  // 1. Roles
  const roles = [
    { name: "DRIVER", description: "Standard EV Driver", isSystemRole: true },
    { name: "OPERATOR", description: "Charging Station Operator", isSystemRole: true },
    { name: "PARKING_OPERATOR", description: "Parking Infrastructure Operator", isSystemRole: true },
    { name: "ADMIN", description: "Platform Administrator", isSystemRole: true },
  ];

  const roleRecords: Record<string, any> = {};
  for (const role of roles) {
    roleRecords[role.name] = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Permissions
  const permissionsData = [
    { resource: "user", action: "read" },
    { resource: "user", action: "update" },
    { resource: "user", action: "manage" },
    { resource: "vehicle", action: "read" },
    { resource: "vehicle", action: "create" },
    { resource: "vehicle", action: "update" },
    { resource: "vehicle", action: "delete" },
    { resource: "journey", action: "read" },
    { resource: "journey", action: "create" },
    { resource: "journey", action: "cancel" },
    { resource: "station", action: "read" },
    { resource: "station", action: "create" },
    { resource: "station", action: "update" },
    { resource: "station", action: "delete" },
    { resource: "station", action: "manage" },
    { resource: "charger", action: "read" },
    { resource: "charger", action: "create" },
    { resource: "charger", action: "update" },
    { resource: "charger", action: "manage" },
    { resource: "reservation", action: "read" },
    { resource: "reservation", action: "create" },
    { resource: "reservation", action: "update" },
    { resource: "reservation", action: "cancel" },
    { resource: "parking", action: "read" },
    { resource: "parking", action: "create" },
    { resource: "parking", action: "update" },
    { resource: "parking", action: "manage" },
    { resource: "payment", action: "read" },
    { resource: "payment", action: "create" },
    { resource: "payment", action: "refund" },
    { resource: "iot", action: "read" },
    { resource: "iot", action: "unlock" },
    { resource: "iot", action: "lock" },
    { resource: "iot", action: "manage" },
    { resource: "session", action: "read" },
    { resource: "session", action: "manage" },
    { resource: "analytics", action: "read" },
    { resource: "device", action: "manage" },
  ];

  const permRecords: Record<string, any> = {};
  for (const p of permissionsData) {
    const key = `${p.resource}:${p.action}`;
    const desc = `Can ${p.action} ${p.resource}`;
    permRecords[key] = await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: {},
      create: { resource: p.resource, action: p.action, description: desc },
    });
  }

  // 3. Role-Permission mappings
  const rolePermissionMap: Record<string, string[]> = {
    DRIVER: [
      "user:read",
      "vehicle:create", "vehicle:read", "vehicle:update", "vehicle:delete",
      "journey:create", "journey:read", "journey:cancel",
      "station:read", "charger:read",
      "reservation:create", "reservation:read", "reservation:cancel",
      "parking:read", "payment:read", "payment:create", "session:read", "iot:unlock", "analytics:read"
    ],
    OPERATOR: [
      "user:read",
      "station:read", "station:create", "station:update", "station:manage",
      "charger:read", "charger:create", "charger:update", "charger:manage",
      "reservation:read", "session:read", "analytics:read"
    ],
    PARKING_OPERATOR: [
      "user:read",
      "parking:read", "parking:create", "parking:update", "parking:manage",
      "reservation:read", "session:read",
      "iot:read", "iot:unlock", "iot:lock", "iot:manage", "analytics:read"
    ],
    ADMIN: permissionsData.map(p => `${p.resource}:${p.action}`)
  };

  for (const [roleName, perms] of Object.entries(rolePermissionMap)) {
    const roleId = roleRecords[roleName].id;
    for (const pKey of perms) {
      const permissionId = permRecords[pKey]?.id;
      if (permissionId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId } },
          update: {},
          create: { roleId, permissionId }
        });
      }
    }
  }

  // 4. Demo Users
  const demoUsers = [
    { email: "driver@example.com", name: "Demo Driver", role: "DRIVER" },
    { email: "operator@example.com", name: "Demo Operator", role: "OPERATOR" },
    { email: "parking@example.com", name: "Demo Parking Op", role: "PARKING_OPERATOR" },
    { email: "admin@example.com", name: "Demo Admin", role: "ADMIN" }
  ];

  for (const du of demoUsers) {
    const roleId = roleRecords[du.role].id;
    await prisma.user.upsert({
      where: { email: du.email },
      update: { roleId, isActive: true },
      create: {
        email: du.email,
        name: du.name,
        roleId: roleId,
        passwordHash: "$2b$10$dummyhashedpasswordfordemoonly",
        isActive: true
      }
    });
  }
}



async function runAllTests() {
  console.log("==================================================");
  console.log("⚡ EV Mobility Platform - Backend API Foundation Tests");
  console.log("==================================================");

  await seedDatabaseIfEmpty();

  let passed = 0;
  let failed = 0;


  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ ${name}`);
      console.error(`     Error: ${err.message}`);
      if (err.response) {
        console.error(`     Status: ${err.response.status}, Body: ${JSON.stringify(err.response.body)}`);
      }
      failed++;
    }
  }

  let driverToken = "";
  let operatorToken = "";
  let parkingOpToken = "";
  let adminToken = "";

  let driverId = "";
  let operatorId = "";
  let parkingOpId = "";
  let adminId = "";

  let testVehicleId = "";
  let testJourneyId = "";
  let testStationId = "";
  let testChargerId = "";
  let testLocationId = "";
  let testBayId = "";
  let testDeviceId = "";
  let testReservationId = "";

  console.log("\n[1] Health & Environment Endpoints:");
  await test("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    if (res.status !== 200 || res.body.status !== "ok") throw new Error(`Expected 200 ok, got ${res.status}`);
  });

  await test("GET /api/v1/health -> 200 with envelope and requestId", async () => {
    const res = await request(app).get("/api/v1/health");
    if (res.status !== 200 || !res.body.success || !res.headers["x-request-id"]) throw new Error(`Envelope or requestId missing`);
  });

  await test("GET /api/v1/health/ready -> 200 DB connected", async () => {
    const res = await request(app).get("/api/v1/health/ready");
    if (res.status !== 200 || !res.body.success) throw new Error(`Ready check failed`);
  });

  console.log("\n[2] Authentication & Token Generation:");
  await test("POST /api/v1/auth/login -> 200 for Driver", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "driver@example.com", password: "password123" });
    if (res.status !== 200 || !res.body.data?.token) throw new Error(`Driver login failed: ${JSON.stringify(res.body)}`);
    driverToken = res.body.data.token;
    driverId = res.body.data.user.id;
  });

  await test("POST /api/v1/auth/login -> 200 for Operator", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "operator@example.com", password: "password123" });
    if (res.status !== 200 || !res.body.data?.token) throw new Error(`Operator login failed`);
    operatorToken = res.body.data.token;
    operatorId = res.body.data.user.id;
  });

  await test("POST /api/v1/auth/login -> 200 for Parking Operator", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "parking@example.com", password: "password123" });
    if (res.status !== 200 || !res.body.data?.token) throw new Error(`Parking Operator login failed`);
    parkingOpToken = res.body.data.token;
    parkingOpId = res.body.data.user.id;
  });

  await test("POST /api/v1/auth/login -> 200 for Admin", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "admin@example.com", password: "password123" });
    if (res.status !== 200 || !res.body.data?.token) throw new Error(`Admin login failed`);
    adminToken = res.body.data.token;
    adminId = res.body.data.user.id;
  });

  await test("POST /api/v1/auth/login -> 401 on wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "driver@example.com", password: "bad" });
    if (res.status !== 401 || res.body.success !== false) throw new Error(`Expected 401 rejected`);
  });

  await test("GET /api/v1/auth/me -> 401 without Bearer token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    if (res.status !== 401) throw new Error(`Expected 401 without token`);
  });

  await test("GET /api/v1/auth/me -> 200 with valid Bearer token", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${driverToken}`);
    if (res.status !== 200 || res.body.data?.user?.email !== "driver@example.com") throw new Error(`Failed to resolve me`);
  });

  console.log("\n[3] Vehicles & Ownership Verification:");
  await test("POST /api/v1/vehicles -> 201 creates driver vehicle", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        name: "Tata Nexon EV Max",
        vehicleClass: "CAR",
        connectorTypes: ["CCS2"],
        batteryCapacityKwh: 40.5,
        batteryHealthPercent: 100,
        efficiencyWhPerKm: 140,
        currentSocPercent: 85,
        reserveSocPercent: 10,
        isDefault: true,
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Vehicle creation failed: ${JSON.stringify(res.body)}`);
    testVehicleId = res.body.data.id;
  });

  await test("GET /api/v1/vehicles/:id -> 200 Owner can access", async () => {
    const res = await request(app).get(`/api/v1/vehicles/${testVehicleId}`).set("Authorization", `Bearer ${driverToken}`);
    if (res.status !== 200 || res.body.data?.id !== testVehicleId) throw new Error(`Owner vehicle read failed`);
  });

  await test("GET /api/v1/vehicles/:id -> 403 Non-owner rejected (IDOR protection)", async () => {
    const res = await request(app).get(`/api/v1/vehicles/${testVehicleId}`).set("Authorization", `Bearer ${operatorToken}`);
    if (res.status !== 403) throw new Error(`Expected 403 forbidden on IDOR attempt, got ${res.status}`);
  });

  console.log("\n[4] Journeys & Planning:");
  await test("POST /api/v1/journeys/plan -> 201 creates journey plan", async () => {
    const res = await request(app)
      .post("/api/v1/journeys/plan")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        vehicleId: testVehicleId,
        originLabel: "Mumbai Central",
        destinationLabel: "Pune Swargate",
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Journey plan failed`);
    testJourneyId = res.body.data.id;
  });

  await test("GET /api/v1/journeys/:id -> 403 Non-owner forbidden", async () => {
    const res = await request(app).get(`/api/v1/journeys/${testJourneyId}`).set("Authorization", `Bearer ${operatorToken}`);
    if (res.status !== 403) throw new Error(`Expected 403 forbidden`);
  });

  console.log("\n[5] Stations & Chargers (Operator RBAC):");
  await test("POST /api/v1/stations -> 201 Station operator creates station", async () => {
    const res = await request(app)
      .post("/api/v1/stations")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        name: "Navi Mumbai Expressway Supercharger",
        latitude: 19.012,
        longitude: 72.845,
        address: "Express Highway, Panvel",
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Station creation failed`);
    testStationId = res.body.data.id;
  });

  await test("PATCH /api/v1/stations/:id -> 403 Driver cannot edit station", async () => {
    const res = await request(app)
      .patch(`/api/v1/stations/${testStationId}`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ name: "Hacked Station Name" });
    if (res.status !== 403) throw new Error(`Expected 403 forbidden for driver modifying station`);
  });

  await test("POST /api/v1/chargers -> 201 Operator creates charger", async () => {
    const res = await request(app)
      .post("/api/v1/chargers")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        stationId: testStationId,
        connectorType: "CCS2",
        maximumPowerKw: 120,
        status: "AVAILABLE",
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Charger creation failed`);
    testChargerId = res.body.data.id;
  });

  console.log("\n[6] Parking, Slots & IoT Devices:");
  await test("POST /api/v1/parking/locations -> 201 Parking Operator creates lot", async () => {
    const res = await request(app)
      .post("/api/v1/parking/locations")
      .set("Authorization", `Bearer ${parkingOpToken}`)
      .send({
        name: "Tech Park Smart EV Parking",
        latitude: 19.076,
        longitude: 72.877,
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Parking location creation failed`);
    testLocationId = res.body.data.id;
  });

  await test("POST /api/v1/parking/bays -> 201 Parking Operator creates bay", async () => {
    const res = await request(app)
      .post("/api/v1/parking/bays")
      .set("Authorization", `Bearer ${parkingOpToken}`)
      .send({
        locationId: testLocationId,
        label: "BAY-E1",
        isEvEnabled: true,
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Parking bay creation failed`);
    testBayId = res.body.data.id;

    // Attach IoT Device
    const device = await prisma.ioTDevice.create({
      data: {
        parkingSlotId: testBayId,
        externalId: `esp32_device_${Date.now()}`,
      },
    });
    testDeviceId = device.id;
  });

  console.log("\n[7] Reservations & Conflict Prevention:");
  const startsAt = new Date(Date.now() + 3600 * 1000).toISOString();
  const endsAt = new Date(Date.now() + 7200 * 1000).toISOString();

  await test("POST /api/v1/reservations -> 201 Driver creates reservation", async () => {
    const res = await request(app)
      .post("/api/v1/reservations")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        parkingSlotId: testBayId,
        startsAt,
        endsAt,
      });
    if (res.status !== 201 || !res.body.data?.id) throw new Error(`Reservation creation failed: ${JSON.stringify(res.body)}`);
    testReservationId = res.body.data.id;
  });

  await test("POST /api/v1/reservations -> 409 Conflict rejection for overlapping slot", async () => {
    const res = await request(app)
      .post("/api/v1/reservations")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        parkingSlotId: testBayId,
        startsAt,
        endsAt,
      });
    if (res.status !== 409 || res.body.error?.code !== "RESERVATION_CONFLICT") {
      throw new Error(`Expected 409 RESERVATION_CONFLICT, got ${res.status}`);
    }
  });

  console.log("\n[8] Payments & Sessions:");
  await test("POST /api/v1/payments/create -> 201 Driver makes payment", async () => {
    const res = await request(app)
      .post("/api/v1/payments/create")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        bookingId: testReservationId,
        amount: 250,
        currency: "INR",
      });
    if (res.status !== 201 || res.body.data?.status !== "COMPLETED") throw new Error(`Payment processing failed`);
  });

  console.log("\n[9] IoT Hardware Command Authorization:");
  await test("POST /api/v1/iot/devices/:id/unlock -> 200 Parking Operator unlocks bay", async () => {
    const res = await request(app)
      .post(`/api/v1/iot/devices/${testDeviceId}/unlock`)
      .set("Authorization", `Bearer ${parkingOpToken}`)
      .send({});
    if (res.status !== 200 || res.body.data?.command !== "UNLOCK") throw new Error(`IoT unlock command failed`);
  });

  await test("POST /api/v1/iot/devices/:id/unlock -> 403 Non-authorized user rejected", async () => {
    const res = await request(app)
      .post(`/api/v1/iot/devices/${testDeviceId}/unlock`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({});
    if (res.status !== 403) throw new Error(`Expected 403 forbidden for unauthorized IoT command`);
  });

  console.log("\n[10] Analytics & RBAC Admin Protection:");
  await test("GET /api/v1/analytics -> 200 Driver gets Driver-scoped metrics", async () => {
    const res = await request(app).get("/api/v1/analytics").set("Authorization", `Bearer ${driverToken}`);
    if (res.status !== 200 || res.body.data?.scope !== "DRIVER") throw new Error(`Expected DRIVER analytics scope`);
  });

  await test("GET /api/v1/users -> 200 Admin accesses all users", async () => {
    const res = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Admin user listing failed`);
  });

  await test("GET /api/v1/users -> 403 Driver cannot access admin user list", async () => {
    const res = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${driverToken}`);
    if (res.status !== 403) throw new Error(`Expected 403 forbidden for driver accessing admin list`);
  });

  console.log("\n==================================================");
  console.log(`🏁 API Foundation Verification Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
