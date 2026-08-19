import { describe, expect, it } from "vitest";
import { isInfrastructureOperatorPermission, isInfrastructureOperatorRole } from "./roles.js";

describe("infrastructure operator compatibility", () => {
  it.each(["INFRASTRUCTURE_OPERATOR", "OPERATOR", "PARKING_OPERATOR"])("accepts %s as an infrastructure role", (role) => {
    expect(isInfrastructureOperatorRole(role)).toBe(true);
  });

  it("does not elevate unrelated roles", () => {
    expect(isInfrastructureOperatorRole("DRIVER")).toBe(false);
    expect(isInfrastructureOperatorPermission("user", "manage")).toBe(false);
  });

  it("combines charging, parking and device capabilities", () => {
    expect(isInfrastructureOperatorPermission("station", "create")).toBe(true);
    expect(isInfrastructureOperatorPermission("parking", "update")).toBe(true);
    expect(isInfrastructureOperatorPermission("iot", "unlock")).toBe(true);
  });
});
