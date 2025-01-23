# Use the official Node.js image as the base
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js image for the production environment
FROM node:20-alpine AS release

# Set the working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
