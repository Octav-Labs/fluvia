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
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Docker Development

1. **Start the backend container:**

   ```bash
   pnpm docker:start
   ```

2. **Build and run manually:**
   ```bash
   pnpm docker:build
   docker run -p 3000:3000 fluvia-backend
   ```

## 📁 Project Structure

```
backend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript (generated)
├── docker/               # Docker configuration files
│   ├── Dockerfile        # Docker image
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

### 🐳 Docker Scripts

- `pnpm docker:build` - Build Docker image
- `pnpm docker:start` - Start backend container
- `pnpm docker:stop` - Stop container
- `pnpm docker:logs` - View container logs

## 🌐 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message
- `GET /*` - 404 handler for undefined routes

## 🐳 Docker Commands

### Build Images

```bash
# Build the Docker image
docker build -f docker/Dockerfile -t fluvia-backend .
```

### Run Containers

```bash
# Run the container
docker run -p 3000:3000 fluvia-backend
```

### Docker Compose

```bash
# Start the backend
pnpm docker:start

# Stop the backend
pnpm docker:stop
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

| Variable   | Default       | Description      |
| ---------- | ------------- | ---------------- |
| `PORT`     | `3000`        | Server port      |
| `NODE_ENV` | `development` | Environment mode |

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Docker Production

```bash
pnpm docker:start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
