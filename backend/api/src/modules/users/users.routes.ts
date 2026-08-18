import { Router } from "express";
import { UserController } from "./users.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/me", authenticate, UserController.getMe);
userRouter.patch("/me", authenticate, UserController.updateMe);

userRouter.get("/", authenticate, authorize("user:manage"), UserController.listUsers);
userRouter.get("/:id", authenticate, authorize("user:read"), UserController.getUserById);
userRouter.patch("/:id", authenticate, authorize("user:update"), UserController.updateUser);
userRouter.patch("/:id/status", authenticate, authorize("user:manage"), UserController.updateUserStatus);
