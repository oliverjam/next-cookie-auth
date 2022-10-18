# ========================================================= #
# Stage 1: build the app                                    #
# This is a separate stage so it can be cached              #
# If you re-deploy without changing code this won't re-run. #
# ========================================================= #

# Start a computer with Node installed
FROM node:16-alpine AS builder
# Move into the /app dir
WORKDIR /app
# Copy over all the files in this repo
COPY . .
# Install all dependencies
RUN npm ci
# Build the Next app
RUN npm run build

# ==================== #
# Stage 2: run the app #
# ==================== #

# Start a computer with Node installed
FROM node:16-alpine AS runner
# Move into the /app dir
WORKDIR /app
# Set NODE_ENV="production" to enable certain prod-only Next features
ENV NODE_ENV production
# Create a new user on the computer to run the app (rather than running as admin)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy the built app files from the previous stage
COPY --from=builder /app ./
# Switch to the new user we created above
USER nextjs
# Start the Next server
CMD ["npm", "start"]
