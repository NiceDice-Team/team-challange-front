FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for flexibility
ARG NODE_ENV=development
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Expose port
EXPOSE 3000

# Default command for development, can be overridden
CMD ["npm", "run", "dev"]
