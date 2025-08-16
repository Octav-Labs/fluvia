# Docker Setup for Fluvia Backend

This Docker Compose configuration sets up a complete development environment with PostgreSQL database and the Fluvia backend API.

## Services

### 1. PostgreSQL Database (`postgres`)

- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Database**: `fluvia` (main) and `fluvia_test` (test)
- **User**: `fluvia_user`
- **Password**: `fluvia_password`
- **Health Check**: Automatically checks if database is ready

### 2. Backend API (`backend`)

- **Port**: `3000`
- **Auto-migration**: Runs database migrations on startup
- **Development Mode**: Uses `ts-node-dev` for hot reloading
- **Dependencies**: Waits for PostgreSQL to be healthy before starting

### 3. pgAdmin (Optional)

- **Port**: `5050`
- **Email**: `admin@fluvia.com`
- **Password**: `admin123`
- **Purpose**: Database management interface

## Quick Start

### 1. Build and Start Services

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### 3. Individual Service Management

```bash
# Start only PostgreSQL
docker-compose up postgres

# Start only backend
docker-compose up backend

# Restart a specific service
docker-compose restart backend
```

## Database Access

### From Host Machine

```bash
# Connect to main database
psql -h localhost -p 5432 -U fluvia_user -d fluvia

# Connect to test database
psql -h localhost -p 5432 -U fluvia_user -d fluvia_test
```

### From Backend Container

```bash
# Access backend container
docker-compose exec backend sh

# Run migrations
pnpm run db:migrate

# Run seeds
pnpm run db:seed
```

### From pgAdmin

1. Open http://localhost:5050 in your browser
2. Login with `admin@fluvia.com` / `admin123`
3. Add new server:
   - Host: `postgres`
   - Port: `5432`
   - Database: `fluvia`
   - Username: `fluvia_user`
   - Password: `fluvia_password`

## Environment Variables

The backend service automatically gets the correct database configuration:

- `DB_HOST=postgres` (Docker service name)
- `DB_PORT=5432`
- `DB_NAME=fluvia`
- `DB_USER=fluvia_user`
- `DB_PASSWORD=fluvia_password`

## Development Workflow

1. **Start Services**: `docker-compose up -d`
2. **Make Code Changes**: Edit files in `./src` (hot reload enabled)
3. **Database Changes**: Create migrations in `./migrations`
4. **Test**: Backend automatically runs migrations on startup
5. **Stop**: `docker-compose down`

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Check backend logs
docker-compose logs backend
```

### Reset Everything

```bash
# Stop and remove everything including volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose build --no-cache
docker-compose up -d
```

### Migration Issues

```bash
# Access backend container
docker-compose exec backend sh

# Check migration status
pnpm run db:migrate:status

# Rollback if needed
pnpm run db:migrate:rollback
```

## Network Configuration

- **Backend**: Accessible at `http://localhost:3000`
- **PostgreSQL**: Accessible at `localhost:5432`
- **pgAdmin**: Accessible at `http://localhost:5050`
- **Internal Network**: Services communicate via `fluvia_network` (172.20.0.0/16)

## Data Persistence

- **PostgreSQL Data**: Stored in `postgres_data` volume
- **pgAdmin Data**: Stored in `pgadmin_data` volume
- **Source Code**: Mounted from host for live development

## Production Considerations

For production deployment:

1. Remove pgAdmin service
2. Use environment variables for sensitive data
3. Enable SSL for database connections
4. Use proper secrets management
5. Consider using external managed PostgreSQL service
