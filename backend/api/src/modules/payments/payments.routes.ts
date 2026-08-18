import { Router } from "express";
import { PaymentController } from "./payments.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const paymentsRouter = Router();

paymentsRouter.get("/", authenticate, authorize("payment:read"), PaymentController.list);
paymentsRouter.get("/:id", authenticate, authorize("payment:read"), PaymentController.getById);
paymentsRouter.post("/create", authenticate, authorize("payment:create"), PaymentController.create);
