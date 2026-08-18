import { prisma } from "../lib/prisma.js";
import { AuthenticatedUser } from "./authorization.types.js";

export class AuthorizationService {
  /**
   * Checks if a user has a specific permission via their role.
   */
  static async hasPermission(user: AuthenticatedUser, resource: string, action: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    if (!user.roleId) return false;

    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: user.roleId,
        permission: {
          resource,
          action
        }
      }
    });

    return !!hasPermission;
  }
}
