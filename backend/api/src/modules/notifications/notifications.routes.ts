import { Router } from "express";
import { NotificationController } from "./notifications.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", authenticate, NotificationController.list);
notificationsRouter.patch("/:id/read", authenticate, NotificationController.markRead);
