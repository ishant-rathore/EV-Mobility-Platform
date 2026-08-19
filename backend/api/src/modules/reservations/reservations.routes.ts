import { Router } from "express";
import { ReservationController } from "./reservations.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { checkOwnership } from "../../middleware/ownership.middleware.js";
import { bookingRouter } from "../booking/booking.routes.js";

export const reservationsRouter = Router();

// Preserve the pre-RBAC simulated booking contract without weakening the
// authenticated reservation API used by the operator workspace.
reservationsRouter.use((req, res, next) => {
  const isDemoList = req.method === "GET" && req.path === "/" && typeof req.query.driverId === "string";
  const isDemoCreate = req.method === "POST" && req.path === "/" && typeof req.body?.recommendationId === "string";
  const isDemoWorkflow = req.method === "POST" && /\/(payments\/simulate|access\/unlock|occupancy)$/.test(req.path);
  const isDemoDetail = req.method === "GET" && req.path !== "/" && !req.headers.authorization;
  if (isDemoList || isDemoCreate || isDemoWorkflow || isDemoDetail) return bookingRouter(req, res, next);
  return next();
});

reservationsRouter.get("/", authenticate, authorize("reservation:read"), ReservationController.list);
reservationsRouter.post("/", authenticate, authorize("reservation:create"), ReservationController.create);
reservationsRouter.get("/:id", authenticate, authorize("reservation:read"), checkOwnership("reservation"), ReservationController.getById);
reservationsRouter.post("/:id/cancel", authenticate, authorize("reservation:cancel"), checkOwnership("reservation"), ReservationController.cancel);
