import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingId = req.headers["x-request-id"];
  const requestId = (typeof incomingId === "string" && incomingId.trim()) ? incomingId : `req_${crypto.randomUUID()}`;
  
  (req as any).id = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}
