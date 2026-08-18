import type { CorsOptions } from "cors";
import { env } from "./env.js";

export const corsOptions: CorsOptions = { origin: env.WEB_ORIGIN };
