import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttpImport from "pino-http";

// pino-http's .d.ts declares `export default` for a CJS-only package with no
// "exports" map; under NodeNext + "type": "module" TS resolves the import as
// the module namespace instead of unwrapping it. Runtime shape is correct
// (verified via the dev server and the request-logging integration tests).
const pinoHttp = pinoHttpImport as unknown as typeof pinoHttpImport.default;
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
