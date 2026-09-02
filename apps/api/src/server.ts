import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { config } from "./config.js";
import { registerRoutes } from "./routes/index.js";

export function buildServer() {
  const app = Fastify({
    logger: true
  });

  app.register(cors, {
    origin: true
  });

  app.register(rateLimit, {
    max: config.freeRateLimitPerMinute,
    timeWindow: "1 minute"
  });

  registerRoutes(app);
  return app;
}

const app = buildServer();

app.listen({ port: config.port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
