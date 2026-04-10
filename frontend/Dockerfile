FROM node:20-alpine as build-stage

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .

RUN yarn build

FROM alpine:latest
WORKDIR /app
COPY --from=build-stage /app/build ./build