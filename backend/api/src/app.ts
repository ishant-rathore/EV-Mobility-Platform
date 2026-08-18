<<<<<<< HEAD
import express from 'express';

export const app = express();
app.use(express.json());
=======
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { API_PREFIX, APP_NAME } from "./config/constants.js";
import { corsOptions } from "./config/cors.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";
import { apiRouter } from "./modules/index.js";

export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: APP_NAME });
});

app.use(API_PREFIX, apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
>>>>>>> junior/main
