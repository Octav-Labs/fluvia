# Railway Deployment Guide for Fluvia Backend

## Overview

This guide covers deploying the Fluvia backend to Railway, including configuration, environment variables, and troubleshooting.

## Prerequisites

- Railway account and CLI installed
- PostgreSQL database (can be provisioned through Railway)
- Privy app credentials

## Configuration Files

### railway.toml

The main Railway configuration file includes:

- Build configuration using nixpacks
- Health check endpoint at `/v1/healthcheck`
- Restart policies for reliability
- Environment variable templates

### Environment Variables

The following environment variables must be set in Railway:

#### Required Database Variables:

- `DB_HOST` - PostgreSQL host (Railway will provide this)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_SSL` - SSL mode (set to "true" for Railway)

#### Required Privy Variables:

- `PRIVY_APP_ID` - Your Privy application ID
- `PRIVY_APP_SECRET` - Your Privy application secret

#### Optional Variables:

- `NODE_ENV` - Set to "production" (already configured)
- `PORT` - Railway will set this automatically
- `PNPM_HOME` - PNPM home directory (already configured)

## Deployment Steps

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**

   ```bash
   railway login
   ```

3. **Link your project:**

   ```bash
   cd backend
   railway link
   ```

4. **Set environment variables:**

   ```bash
   railway variables set DB_HOST=your_db_host
   railway variables set DB_NAME=your_db_name
   railway variables set DB_USER=your_db_user
   railway variables set DB_PASSWORD=your_db_password
   railway variables set PRIVY_APP_ID=your_privy_app_id
   railway variables set PRIVY_APP_SECRET=your_privy_app_secret
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

## Health Check Endpoints

The application provides two health check endpoints:

- `/health` - Basic health check
- `/v1/healthcheck` - Railway-specific health check (used by Railway)

## Build Process

The deployment process:

1. Railway installs dependencies using `pnpm install`
2. Post-install script runs `pnpm run build` to compile TypeScript
3. Application starts using `pnpm start` (runs `node dist/index.js`)

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check that all dependencies are in package.json
   - Verify TypeScript compilation works locally

2. **Database Connection Issues:**
   - Ensure all DB\_\* environment variables are set
   - Check that the database is accessible from Railway

3. **Health Check Failures:**
   - Verify the application is starting correctly
   - Check logs for startup errors

4. **Port Issues:**
   - Railway automatically sets the PORT environment variable
   - The application listens on process.env.PORT

### Logs and Debugging:

```bash
railway logs
railway status
```

## Monitoring

Railway provides:

- Automatic health checks every 30 seconds
- Restart on failure (max 3 retries)
- Log aggregation and monitoring
- Performance metrics

## Security Notes

- All environment variables are encrypted in Railway
- Database connections use SSL by default
- Helmet.js provides security headers
- CORS is enabled for frontend communication
