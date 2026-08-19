import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";
import { isInfrastructureOperatorRole } from "../../shared/roles.js";

export class SessionService {
  static async list(userId: string, roleName: string, page = 1, limit = 20) {
    const where = roleName === "ADMIN"
      ? {}
      : isInfrastructureOperatorRole(roleName)
        ? { charger: { station: { operatorId: userId } } }
        : { userId };
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
    const managesSession = isInfrastructureOperatorRole(roleName) && session.charger.station.operatorId === userId;
    if (roleName !== "ADMIN" && !managesSession && session.userId !== userId) {
      throw new AppError("You do not have access to this session.", 403, "FORBIDDEN");
    }
    return session;
  }

  static async start(userId: string, data: { chargerId: string }) {
    const charger = await prisma.charger.findUnique({ where: { id: data.chargerId } });
    if (!charger) {
      throw new AppError("Charger not found.", 404, "CHARGER_NOT_FOUND");
    }
    const existingActive = await prisma.chargingSession.findFirst({
      where: { userId, chargerId: data.chargerId, endedAt: null },
    });
    if (existingActive) {
      throw new AppError("An active charging session already exists for this charger.", 409, "SESSION_ALREADY_ACTIVE");
    }
    return prisma.chargingSession.create({
      data: { userId, chargerId: data.chargerId },
      include: { charger: { include: { station: true } } },
    });
  }

  static async stop(id: string, userId: string, roleName: string, data: { energyKwh?: number; cost?: number }) {
    const session = await this.getById(id, userId, roleName);
    if (session.endedAt) {
      throw new AppError("Charging session has already ended.", 400, "SESSION_ALREADY_ENDED");
    }
    return prisma.chargingSession.update({
      where: { id },
      data: { endedAt: new Date(), energyKwh: data.energyKwh, cost: data.cost },
      include: { charger: { include: { station: true } } },
    });
  }
}
