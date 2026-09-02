FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @tradeguard/dashboard build
EXPOSE 5173
CMD ["pnpm", "--filter", "@tradeguard/dashboard", "dev"]
