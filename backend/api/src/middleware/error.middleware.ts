import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/errors.js";

export const notFoundMiddleware: RequestHandler = (_request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
};

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.issues },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }

  response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } });
};
