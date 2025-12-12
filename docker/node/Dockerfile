FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY ./src/frontend/package.json ./src/frontend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY ./src/frontend .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
