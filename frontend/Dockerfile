# Stage 1: Build the production assets
FROM node:20-alpine AS builder
WORKDIR /app

# Get arg from docker-compose
ARG VITE_API_BASE_URL
# Define arg as env variable
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve using an ultra-lightweight web server
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
