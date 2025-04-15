FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat ffmpeg bash openssl openssl-dev
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

FROM base AS pruned
WORKDIR /app
COPY . .
RUN turbo prune --scope=frontend --docker

FROM base AS installer
WORKDIR /app

COPY --from=pruned /app/out/json/ .
COPY --from=pruned /app/out/pnpm-lock.yaml /app/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

FROM base as builder
WORKDIR /app
ARG COMMIT
ENV COMMIT=${COMMIT}

COPY --from=installer --link /app .
COPY --from=pruned /app/out/full/ .
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --no-cache

FROM base AS runner
WORKDIR /app
RUN apk add --no-cache ffmpeg curl bash openssl openssl-dev

COPY --from=builder /app .

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["sh", "-c", "pnpm prisma migrate:deploy & pnpm frontend start"]
