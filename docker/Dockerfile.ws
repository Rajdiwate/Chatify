FROM node:24-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest 

COPY ./package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY turbo.json .
COPY ./packages ./packages
COPY ./apps/ws-server ./apps/ws-server
RUN pnpm install --frozen-lockfile

ENV REDIS_URL="redis://redis:6379"
ENV KAFKA_URL="kafka:9092"
ENV MAIN_TOPIC="persist"
ENV JWT_SECRET=fjonrojfnwrojvirnjvirjfreopif

RUN pnpm run ws:build
EXPOSE 3000



CMD ["pnpm", "run", "ws:start"] 