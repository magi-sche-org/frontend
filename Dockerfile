ARG NODE_VERSION=18

# Build phase
FROM node:$NODE_VERSION-slim AS builder
WORKDIR /app

# Prepare node_modules
RUN npm install -g pnpm
COPY . .

ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --production

RUN ./node_modules/next/dist/bin/next build

# Run phase
FROM gcr.io/distroless/nodejs$NODE_VERSION-debian12:latest AS runner

LABEL org.opencontainers.image.source=https://github.com/magi-sche-org/frontend
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Copy artifacts
CMD ["./node_modules/next/dist/bin/next", "start"]
