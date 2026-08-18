import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class NotificationService {
  static async list(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async markRead(id: string, userId: string) {
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new AppError("Notification not found.", 404, "NOT_FOUND");
    if (notif.userId !== userId) throw new AppError("Access denied.", 403, "FORBIDDEN");

    return prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }
}
