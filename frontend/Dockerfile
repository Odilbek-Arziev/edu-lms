FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM alpine:3.20

RUN mkdir -p /mnt/dist /tmp/dist
COPY --from=builder /app/dist /tmp/dist

CMD ["sh", "-c", "cp -r /tmp/dist/. /mnt/dist/"]