# Stage 1: Build the Vite React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run with Node.js server + Prometheus metrics
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY server.js .

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
