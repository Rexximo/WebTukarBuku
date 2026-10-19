import "dotenv/config";
import { z } from "zod";

const booleanString = z
  .string()
  .optional()
  .transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().trim().default(""),
  USE_MEMORY_DB: booleanString,
  SEED_ON_START: booleanString,
  JWT_SECRET: z.string().min(16).default("dev-secret-tukar-buku-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("tb_token"),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  MAX_ACTIVE_REQUESTS: z.coerce.number().int().min(1).default(2),
  REQUEST_EXPIRY_DAYS: z.coerce.number().int().min(1).default(3),
  EXPIRY_CHECK_INTERVAL_MS: z.coerce.number().int().min(10000).default(60000),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(2),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Konfigurasi environment tidak valid:",
    z.treeifyError(parsed.error)
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
