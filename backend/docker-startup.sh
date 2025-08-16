#!/bin/bash

set -e

echo "=== Fluvia Backend Docker Startup Script ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "PNPM version: $(pnpm --version)"
echo "Knex version: $(knex --version)"

echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"
echo "DB_USER: $DB_USER"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "PRIVY_APP_ID: $PRIVY_APP_ID"
echo "PRIVY_APP_SECRET: $PRIVY_APP_SECRET"

echo "=== Waiting for database to be ready... ==="
sleep 10

echo "=== Testing database connection ==="
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
  echo "Database is not ready yet. Waiting..."
  sleep 2
done

echo "=== Database is ready! ==="

echo "=== Building application... ==="
pnpm run build

echo "=== Checking migration status... ==="
knex migrate:status

echo "=== Running database migrations... ==="
NODE_ENV=development knex migrate:latest

echo "=== Migration completed successfully! ==="

echo "=== Starting development server... ==="
pnpm run dev
