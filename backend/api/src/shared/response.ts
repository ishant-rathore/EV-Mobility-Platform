import type { Response } from "express";

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
) {
  const payload: { success: true; data: T; meta?: PaginationMeta } = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  error: { code: string; message: string; details?: any },
  statusCode = 500,
  meta?: Record<string, any>
) {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(meta ? { meta } : {}),
  });
}
