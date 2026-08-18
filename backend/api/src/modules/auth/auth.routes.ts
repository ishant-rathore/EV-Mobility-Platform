import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", authenticate, AuthController.me);
