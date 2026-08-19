import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authRateLimit } from "../../middleware/rate-limit.middleware.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimit, AuthController.register);
authRouter.post("/login", authRateLimit, AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", authenticate, AuthController.me);
authRouter.post("/forgot-password", authRateLimit, AuthController.forgotPassword);
authRouter.post("/reset-password", authRateLimit, AuthController.resetPassword);
authRouter.post("/verify-email", authRateLimit, AuthController.verifyEmail);
authRouter.post("/send-verification", authRateLimit, AuthController.sendVerification);
