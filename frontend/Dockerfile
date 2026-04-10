FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /app
COPY --from=build-stage /app/build ./build