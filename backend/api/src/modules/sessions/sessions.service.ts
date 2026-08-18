import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class SessionService {
  static async list(userId: string, roleName: string, page = 1, limit = 20) {
    const where = (roleName === "ADMIN" || roleName === "OPERATOR") ? {} : { userId };
    const skip = (page - 1) * limit;
    const [total, sessions] = await Promise.all([
      prisma.chargingSession.count({ where }),
      prisma.chargingSession.findMany({
        where,
        skip,
        take: limit,
        include: { charger: { include: { station: true } }, user: { select: { id: true, name: true } } },
        orderBy: { startedAt: "desc" },
      }),
    ]);
    return { sessions, meta: { page, limit, total } };
  }

  static async getById(id: string, userId: string, roleName: string) {
    const session = await prisma.chargingSession.findUnique({
      where: { id },
      include: { charger: { include: { station: true } }, user: true },
    });
    if (!session) {
      throw new AppError("Charging session not found.", 404, "SESSION_NOT_FOUND");
    }
    if (roleName !== "ADMIN" && roleName !== "OPERATOR" && session.userId !== userId) {
      throw new AppError("You do not have access to this session.", 403, "FORBIDDEN");
    }
    return session;
  }
}
