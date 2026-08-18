import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../shared/errors.js";
import { sendError } from "../shared/response.js";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  const requestId = (req as any).id;
  sendError(res, { code: "NOT_FOUND", message: "Route not found." }, 404, requestId ? { requestId } : undefined);
};

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = (req as any).id;
  const meta = requestId ? { requestId } : undefined;

  if (error instanceof ZodError) {
    return sendError(
      res,
      {
        code: "VALIDATION_ERROR",
        message: "Invalid request data.",
        details: error.issues,
      },
      400,
      meta,
    );
  }

  if (error instanceof AppError) {
    return sendError(
      res,
      {
        code: error.code,
        message: error.message,
      },
      error.statusCode,
      meta,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return sendError(
        res,
        {
          code: "CONFLICT",
          message: "A database unique constraint was violated.",
          details: error.meta,
        },
        409,
        meta,
      );
    }
    if (error.code === "P2025") {
      return sendError(
        res,
        {
          code: "NOT_FOUND",
          message: "The requested record was not found.",
          details: error.meta,
        },
        404,
        meta,
      );
    }
    if (error.code === "P2003") {
      return sendError(
        res,
        {
          code: "BAD_REQUEST",
          message: "Foreign key constraint failed.",
          details: error.meta,
        },
        400,
        meta,
      );
    }
  }

  console.error("Unhandled API Error:", error);
  return sendError(
    res,
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    },
    500,
    meta,
  );
};

