FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/logger/package.json packages/logger/package.json
COPY packages/security/package.json packages/security/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/testing/package.json packages/testing/package.json
COPY services/collector/package.json services/collector/package.json
COPY services/worker/package.json services/worker/package.json
RUN corepack enable && pnpm install --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @tradeguard/config build && pnpm --filter @tradeguard/logger build && pnpm --filter @tradeguard/security build && pnpm --filter @tradeguard/shared build && pnpm --filter @tradeguard/api build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN addgroup -S tradeguard && adduser -S tradeguard -G tradeguard
USER tradeguard
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:8080/api/v1/health/live || exit 1
CMD ["node", "apps/api/dist/server.js"]
