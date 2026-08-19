import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttpImport from "pino-http";

const pinoHttp = pinoHttpImport as unknown as typeof pinoHttpImport.default;
import { API_PREFIX, APP_NAME } from "./config/constants.js";
import { corsOptions } from "./config/cors.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";
import { apiRouter } from "./modules/index.js";
import { sendSuccess } from "./shared/response.js";
import { prisma } from "./lib/prisma.js";

export const app = express();

// Middleware chain in ordered sequence:
// 1. Request ID
app.use(requestIdMiddleware);

// 2. Security headers
app.use(helmet());

// 3. CORS
app.use(cors(corsOptions));

// 4. JSON body parser
app.use(express.json({ limit: "1mb" }));

// 5. Request logging (skip noisy logs during automated test runs)
if (process.env.NODE_ENV !== "test") {
  app.use(pinoHttp());
}

// Global root /health (for smoke tests and root load balancers)
app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: APP_NAME });
});

// Versioned health check endpoints
app.get(`${API_PREFIX}/health`, (_request, response) => {
  return sendSuccess(response, { status: "ok", service: APP_NAME });
});

app.get(`${API_PREFIX}/health/ready`, async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(response, { status: "ready", database: "connected" });
  } catch (error) {
    return sendSuccess(response, { status: "degraded", database: "disconnected" }, 200);
  }
});

// 6. Versioned API Router
app.use(API_PREFIX, apiRouter);

// 7. 404 handler
app.use(notFoundMiddleware);

// 8. Global error handler
app.use(errorMiddleware);
