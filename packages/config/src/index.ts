import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8080"),
  CHECK_CACHE_TTL_SECONDS: z.coerce.number().int().min(30).max(604800).default(86400),
  FREE_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(10000).default(30),
  PRO_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(100000).default(600),
  ALLOWED_CORS_ORIGINS: z.string().default("http://localhost:5173,chrome-extension://*"),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().min(500).max(30000).default(5000),
  REDIS_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url().optional(),
  GOOGLE_SAFE_BROWSING_API_KEY: z.string().optional()
});

export type TradeGuardConfig = z.infer<typeof envSchema> & {
  allowedCorsOrigins: string[];
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): TradeGuardConfig {
  const parsed = envSchema.parse(env);
  return {
    ...parsed,
    allowedCorsOrigins: parsed.ALLOWED_CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  };
}
