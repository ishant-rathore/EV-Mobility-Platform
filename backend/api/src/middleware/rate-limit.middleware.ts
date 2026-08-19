import rateLimit from "express-rate-limit";
import { sendError } from "../shared/response.js";

/** Applied to auth endpoints that are otherwise unauthenticated and brute-forceable. */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, { code: "RATE_LIMITED", message: "Too many attempts. Please try again later." }, 429);
  },
});
