import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connectivity verified.");
} finally {
  await prisma.$disconnect();
}
