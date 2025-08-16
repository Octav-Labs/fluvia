#!/bin/bash

set -e

echo "=== Fluvia Backend Docker Startup Script ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "PNPM version: $(pnpm --version)"

echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"
echo "DB_USER: $DB_USER"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "PRIVY_APP_ID: $PRIVY_APP_ID"
echo "PRIVY_APP_SECRET: $PRIVY_APP_SECRET"
echo "PRIVY_PRIVATE_KEY: $PRIVY_PRIVATE_KEY"

echo "=== Starting Express server... ==="
# Start the production server directly
node dist/index.js
