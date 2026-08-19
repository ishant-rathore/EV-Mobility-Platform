import { env } from "../../config/env.js";

/**
 * No email provider (SMTP/Resend/SendGrid) is configured in this repository.
 * This logs the message that would be sent so the token/link contract is
 * real and testable end-to-end, without pretending an email was delivered.
 * Swap the body of these functions for a real provider call when one is
 * configured — the call sites and token lifecycle do not need to change.
 */
export class EmailService {
  static async sendVerificationEmail(to: string, token: string): Promise<void> {
    const link = `${env.WEB_ORIGIN}/verify-email?token=${encodeURIComponent(token)}`;
    console.log(`[email:stub] Verification email to ${to}: ${link}`);
  }

  static async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${env.WEB_ORIGIN}/reset-password/${encodeURIComponent(token)}`;
    console.log(`[email:stub] Password reset email to ${to}: ${link}`);
  }
}
