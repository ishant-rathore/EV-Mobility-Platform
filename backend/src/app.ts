import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { ZodError } from "zod";
import { API_PREFIX, APP_NAME } from "./config/constants.js";
import { env } from "./config/env.js";
import { apiRouter } from "./modules/index.js";
import { AppError } from "./shared/errors.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: APP_NAME });
});

app.use(API_PREFIX, apiRouter);

app.use((_request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.issues },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Unexpected server error" },
  });
};

app.use(errorHandler);
