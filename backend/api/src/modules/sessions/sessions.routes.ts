import { Router } from "express";
import { SessionController } from "./sessions.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const sessionsRouter = Router();

sessionsRouter.get("/", authenticate, authorize("session:read"), SessionController.list);
sessionsRouter.get("/:id", authenticate, authorize("session:read"), SessionController.getById);
