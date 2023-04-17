FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM nginx:1.23.1-alpine AS production
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build ./
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]