import type { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "../../../backend/api/src/modules/ev/ev.constants.js";
import { DEMO_VEHICLES } from "../../../backend/api/src/modules/ev/ev.demo-data.js";

/**
 * Seeds the demo user and the four Module 1 demo vehicles (one per vehicle
 * class). Idempotent — safe to run against an already-seeded database.
 */
export async function seedEvVehicles(prisma: PrismaClient): Promise<void> {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: "demo.driver@volttwin.ai",
      name: "Demo Driver",
    },
  });

  for (const { id, ...input } of DEMO_VEHICLES) {
    await prisma.eVVehicle.upsert({
      where: { id },
      update: {},
      create: { id, ...input, userId: DEMO_USER_ID },
    });
  }
}
