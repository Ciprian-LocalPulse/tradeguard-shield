FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN corepack enable && pnpm install --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @tradeguard/shared build && pnpm --filter @tradeguard/api build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 8080
CMD ["node", "apps/api/dist/server.js"]
