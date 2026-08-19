import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schemas.js";
import { sendSuccess } from "../../shared/response.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await AuthService.register(input);
      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await AuthService.login(input);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { message: "Logged out successfully." }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { user: req.user }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = forgotPasswordSchema.parse(req.body);
      await AuthService.forgotPassword(input.email);
      return sendSuccess(res, {
        message: "If an account exists for this email, you'll receive password-reset instructions.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(input.token, input.password);
      return sendSuccess(res, { message: "Your password has been reset successfully." });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const input = verifyEmailSchema.parse(req.body);
      await AuthService.verifyEmail(input.token);
      return sendSuccess(res, { message: "Email verified successfully." });
    } catch (error) {
      next(error);
    }
  }

  static async sendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const input = resendVerificationSchema.parse(req.body);
      await AuthService.resendVerification(input.email);
      return sendSuccess(res, {
        message: "If an account exists for this email and isn't verified yet, a new verification email has been sent.",
      });
    } catch (error) {
      next(error);
    }
  }
}
