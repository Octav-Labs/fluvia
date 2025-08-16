#!/bin/bash

echo "=== Testing Knex in Docker Container ==="

# Test if we can connect to the database
echo "Testing database connection..."
knex migrate:status

echo ""
echo "=== Available Knex Commands ==="
echo "knex migrate:latest    - Run all pending migrations"
echo "knex migrate:rollback  - Rollback last migration"
echo "knex migrate:status    - Show migration status"
echo "knex seed:run          - Run all seeds"
echo "knex seed:run --specific=01_complete_data.ts - Run specific seed"

echo ""
echo "=== Testing Migration ==="
knex migrate:latest

echo ""
echo "=== Migration Status ==="
knex migrate:status

echo ""
echo "=== Testing Seed ==="
knex seed:run

echo ""
echo "=== All tests completed! ==="
