import { PrismaClient } from "@prisma/client";

export async function seedRbac(prisma: PrismaClient) {
  console.log("Seeding Roles and Permissions...");

  // 1. Roles
  const roles = [
    { name: "DRIVER", description: "Standard EV Driver", isSystemRole: true },
    { name: "INFRASTRUCTURE_OPERATOR", description: "Unified charging and parking infrastructure operator", isSystemRole: true },
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
    { resource: "session", action: "create" },
    { resource: "session", action: "update" },
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
  const infrastructurePermissions = [
    "station:read", "station:create", "station:update", "station:delete", "station:manage",
    "charger:read", "charger:create", "charger:update", "charger:manage",
    "parking:read", "parking:create", "parking:update", "parking:manage",
    "reservation:read", "session:read", "session:manage", "payment:read",
    "iot:read", "iot:unlock", "iot:lock", "iot:manage", "analytics:read", "device:manage",
  ];

  const rolePermissionMap: Record<string, string[]> = {
    DRIVER: [
      "vehicle:create", "vehicle:read", "vehicle:update", "vehicle:delete",
      "journey:create", "journey:read", "journey:cancel",
      "station:read", "charger:read",
      "reservation:create", "reservation:read", "reservation:cancel",
      "parking:read", "payment:read", "payment:create", "session:read", "session:create", "session:update", "iot:unlock"
    ],
    INFRASTRUCTURE_OPERATOR: infrastructurePermissions,
    // Legacy roles intentionally retain compatibility during the account migration.
    OPERATOR: infrastructurePermissions,
    PARKING_OPERATOR: infrastructurePermissions,
    ADMIN: permissionsData.map(p => `${p.resource}:${p.action}`) // All permissions
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
      update: { roleId, emailVerifiedAt: new Date() },
      create: {
        email: du.email,
        name: du.name,
        roleId: roleId,
        passwordHash: "$2b$10$dummyhashedpasswordfordemoonly", // Not for prod
        isActive: true,
        emailVerifiedAt: new Date(), // Demo accounts skip email verification.
      }
    });
  }

  console.log("RBAC Seed completed.");
}
