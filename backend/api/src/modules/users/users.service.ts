import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class UserService {
  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role?.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  static async updateMe(userId: string, data: { name?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: { role: true },
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role?.name,
    };
  }

  static async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role?.name,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      meta: { page, limit, total },
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role?.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  static async updateUser(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role?.name,
      isActive: user.isActive,
    };
  }

  static async updateUserStatus(id: string, isActive: boolean) {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      include: { role: true },
    });
    return {
      id: user.id,
      isActive: user.isActive,
    };
  }
}
