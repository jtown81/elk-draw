# South Dakota Elk Draw Analyzer - Production Docker Image

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build for production
RUN pnpm build

# Runtime stage - Use lightweight web server
FROM node:20-alpine

WORKDIR /app

# Install pnpm and http-server for serving static files
RUN npm install -g pnpm http-server

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3456

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3456/ || exit 1

# Serve the app on port 3456
CMD ["http-server", "dist", "-p", "3456", "-c-1", "--gzip"]
