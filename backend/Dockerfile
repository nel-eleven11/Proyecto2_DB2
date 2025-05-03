# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files first to optimize caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application files
COPY . .

# Expose port
EXPOSE 8080

# Start the server
CMD ["bun", "src/server.ts"]

