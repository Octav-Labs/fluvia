# Fluvia Backend

A TypeScript + Express.js backend API with Docker support.

## 🚀 Features

- **TypeScript** - Modern JavaScript with type safety
- **Express.js** - Fast, unopinionated web framework
- **Docker** - Containerized deployment
- **Security** - Helmet.js for security headers
- **CORS** - Cross-origin resource sharing enabled
- **Logging** - Morgan HTTP request logger
- **Environment Variables** - Configurable via .env files
- **Code Quality** - ESLint + Prettier with import sorting

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn or pnpm

## 🛠️ Installation

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Docker Development

1. **Start development container:**
   ```bash
   docker-compose --profile dev up backend-dev
   ```

2. **Start production container:**
   ```bash
   docker-compose up backend
   ```

3. **Build and run:**
   ```bash
   docker build -f docker/Dockerfile -t fluvia-backend .
   docker run -p 3000:3000 fluvia-backend
   ```

## 📁 Project Structure

```
backend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript (generated)
├── docker/               # Docker configuration files
│   ├── Dockerfile        # Production Docker image
│   ├── Dockerfile.dev    # Development Docker image
│   ├── docker-compose.yml # Docker Compose configuration
│   └── .dockerignore     # Docker ignore file
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm clean` - Remove build artifacts
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 🌐 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message
- `GET /*` - 404 handler for undefined routes

## 🐳 Docker Commands

### Build Images
   ```bash
   # Production
   docker build -f docker/Dockerfile -t fluvia-backend .

   # Development
   docker build -f docker/Dockerfile.dev -t fluvia-backend:dev .
   ```

### Run Containers
```bash
# Production
docker run -p 3000:3000 fluvia-backend

# Development with volume mounting
docker run -p 3001:3000 -v $(pwd):/app fluvia-backend:dev
```

### Docker Compose
```bash
# Start production
docker-compose -f docker/docker-compose.yml up

# Start development
docker-compose -f docker/docker-compose.yml --profile dev up

# Stop all services
docker-compose -f docker/docker-compose.yml down
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin requests
- **Input Validation** - Request body parsing
- **Error Handling** - Centralized error management

## 🎨 Code Quality

- **ESLint** - TypeScript linting with strict rules
- **Prettier** - Code formatting and consistency
- **Import Sorting** - Automatic import organization
- **Unused Imports** - Automatic cleanup of unused imports

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Production
```bash
docker-compose -f docker/docker-compose.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
