export const INFRASTRUCTURE_OPERATOR_ROLE = "INFRASTRUCTURE_OPERATOR" as const;

export const INFRASTRUCTURE_OPERATOR_ROLE_ALIASES = [
  INFRASTRUCTURE_OPERATOR_ROLE,
  "OPERATOR",
  "PARKING_OPERATOR",
] as const;

const infrastructureRoles = new Set<string>(INFRASTRUCTURE_OPERATOR_ROLE_ALIASES);

const infrastructurePermissions = new Set([
  "station:read",
  "station:create",
  "station:update",
  "station:delete",
  "station:manage",
  "charger:read",
  "charger:create",
  "charger:update",
  "charger:manage",
  "reservation:read",
  "session:read",
  "session:manage",
  "parking:read",
  "parking:create",
  "parking:update",
  "parking:manage",
  "payment:read",
  "iot:read",
  "iot:unlock",
  "iot:lock",
  "iot:manage",
  "analytics:read",
  "device:manage",
]);

export function isInfrastructureOperatorRole(roleName?: string | null): boolean {
  return Boolean(roleName && infrastructureRoles.has(roleName));
}

export function isInfrastructureOperatorPermission(resource: string, action: string): boolean {
  return infrastructurePermissions.has(`${resource}:${action}`);
}
