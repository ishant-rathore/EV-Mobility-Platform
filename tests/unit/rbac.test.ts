import { Request, Response, NextFunction } from "express";
import { authorize } from "../../backend/api/src/middleware/auth.middleware.js";
import { checkOwnership } from "../../backend/api/src/middleware/ownership.middleware.js";

// Mocking PrismaClient
jest.mock("@prisma/client", () => {
  const mPrisma = {
    rolePermission: {
      findFirst: jest.fn(),
    },
    eVVehicle: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("RBAC Authorization & Ownership Middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: "driver-id-1",
        email: "driver@example.com",
        roleId: "role-driver-1",
        roleName: "DRIVER",
      }
    } as any;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe("authorize()", () => {
    it("should allow if ADMIN", async () => {
      mockRequest.user!.roleName = "ADMIN";
      const middleware = authorize("vehicle:create");
      
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
      expect(prisma.rolePermission.findFirst).not.toHaveBeenCalled();
    });

    it("should allow if permission exists", async () => {
      prisma.rolePermission.findFirst.mockResolvedValueOnce({ id: "perm-1" });
      const middleware = authorize("vehicle:create");
      
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(prisma.rolePermission.findFirst).toHaveBeenCalledWith({
        where: {
          roleId: "role-driver-1",
          permission: { resource: "vehicle", action: "create" }
        }
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should deny (403) if permission does not exist", async () => {
      prisma.rolePermission.findFirst.mockResolvedValueOnce(null);
      const middleware = authorize("station:manage");
      
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden: Insufficient permissions" });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("checkOwnership()", () => {
    it("should allow ADMIN regardless of ownership", async () => {
      mockRequest.user!.roleName = "ADMIN";
      mockRequest.params = { id: "vehicle-123" };
      
      const middleware = checkOwnership("vehicle");
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should allow if user owns the vehicle", async () => {
      mockRequest.params = { id: "vehicle-123" };
      prisma.eVVehicle.findUnique.mockResolvedValueOnce({ id: "vehicle-123", userId: "driver-id-1" });
      
      const middleware = checkOwnership("vehicle");
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should deny (403) if user does NOT own the vehicle", async () => {
      mockRequest.params = { id: "vehicle-123" };
      prisma.eVVehicle.findUnique.mockResolvedValueOnce({ id: "vehicle-123", userId: "driver-id-2" });
      
      const middleware = checkOwnership("vehicle");
      await middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden: You do not own this resource" });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
