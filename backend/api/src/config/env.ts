import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://volttwin:volttwin@localhost:5432/volttwin"),
  MQTT_URL: z.string().default("mqtt://localhost:1883"),
  JWT_SECRET: z.string().default("ev_mobility_jwt_secret_demo"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
