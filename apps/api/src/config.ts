export const config = {
  port: Number(process.env.API_PORT ?? 8080),
  cacheTtlSeconds: Number(process.env.CHECK_CACHE_TTL_SECONDS ?? 86_400),
  freeRateLimitPerMinute: Number(process.env.FREE_RATE_LIMIT_PER_MINUTE ?? 30),
  proRateLimitPerMinute: Number(process.env.PRO_RATE_LIMIT_PER_MINUTE ?? 600)
};
