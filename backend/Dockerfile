FROM node:16-alpine AS builder
WORKDIR /app 
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY ecosystem.config.js ./
COPY --from=builder /app/dist/ /app/dist/
RUN npm install pm2 -g
EXPOSE 3000
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]