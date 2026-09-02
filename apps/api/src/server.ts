import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { createLogEvent, redactSensitive } from "@tradeguard/logger";
import { securityHeaders } from "@tradeguard/security";
import Fastify from "fastify";
import { config } from "./config.js";
import { PublicApiError } from "./errors.js";
import { registerRoutes } from "./routes/index.js";

export function buildServer() {
  const app = Fastify({
    logger: {
      redact: ["req.headers.authorization", "req.headers.cookie", "apiKey", "token", "password"]
    },
    genReqId: () => crypto.randomUUID(),
    requestTimeout: config.REQUEST_TIMEOUT_MS
  });

  app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || config.allowedCorsOrigins.includes(origin) || config.allowedCorsOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      if (origin.startsWith("chrome-extension://") && config.allowedCorsOrigins.includes("chrome-extension://*")) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin denied"), false);
    }
  });

  app.register(rateLimit, {
    max: config.FREE_RATE_LIMIT_PER_MINUTE,
    timeWindow: "1 minute"
  });

  app.addHook("onRequest", async (_request, reply) => {
    for (const [name, value] of Object.entries(securityHeaders)) {
      reply.header(name, value);
    }
  });

  app.setErrorHandler((error, request, reply) => {
    const requestId = request.id;

    if (error instanceof PublicApiError) {
      request.log.warn(createLogEvent("warn", "public_api_error", { requestId, code: error.code, statusCode: error.statusCode }));
      return reply.code(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          requestId
        }
      });
    }

    request.log.error(createLogEvent("error", "internal_api_error", { requestId, error: redactSensitive(error) }));
    return reply.code(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
        requestId
      }
    });
  });

  registerRoutes(app);
  return app;
}

const app = buildServer();

const shutdown = async (signal: string) => {
  app.log.info({ signal }, "shutting_down");
  await app.close();
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

app.listen({ port: config.API_PORT, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
