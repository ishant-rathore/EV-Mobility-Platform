import { PrismaClient } from "@prisma/client";
import { seedEvVehicles } from "./seeds/ev-vehicles.seed.js";
import { seedRbac } from "./seeds/rbac.seed.js";
import { seedStations } from "./seeds/stations.seed.js";

const prisma = new PrismaClient();

async function main() {
  await seedRbac(prisma);
  await seedEvVehicles(prisma);
  await seedStations(prisma);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
