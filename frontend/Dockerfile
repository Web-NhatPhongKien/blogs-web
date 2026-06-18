FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_SERVER_DOMAIN=http://localhost:3000
ENV VITE_SERVER_DOMAIN=$VITE_SERVER_DOMAIN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
