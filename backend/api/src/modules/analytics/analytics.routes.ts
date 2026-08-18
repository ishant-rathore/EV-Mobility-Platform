import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const analyticsRouter = Router();

analyticsRouter.get("/", authenticate, authorize("analytics:read"), AnalyticsController.get);
