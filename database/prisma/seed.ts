import { PrismaClient } from "@prisma/client";
import { seedEvVehicles } from "./seeds/ev-vehicles.seed.js";
import { seedRbac } from "./seeds/rbac.seed.js";

const prisma = new PrismaClient();

async function main() {
  await seedRbac(prisma);
  await seedEvVehicles(prisma);

  await prisma.chargingStation.upsert({
    where: { id: "station-demo-1" },
    update: {},
    create: {
      id: "station-demo-1",
      name: "VoltTwin Central Hub",
      latitude: 19.076,
      longitude: 72.8777,
      address: "Mumbai demo corridor",
      chargers: {
        create: [
          {
            id: "charger-demo-1",
            connectorType: "CCS2",
            maximumPowerKw: 60,
            status: "AVAILABLE",
          },
        ],
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
