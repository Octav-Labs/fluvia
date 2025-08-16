import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import database service
import { DatabaseService, DBConfigurationType } from './services/DatabaseService';
import { authMiddleware } from './middleware/Auth';
import { userMiddleware } from './middleware/UserMiddleware';
import { FluviaManager } from './manager/FluviaManager';

const app: Application = express();
const PORT = process.env.PORT || 3000;
let fluviaManager: FluviaManager | null = null;

// Lazy initialization of FluviaManager
const getFluviaManager = (): FluviaManager => {
  if (!fluviaManager) {
    try {
      fluviaManager = new FluviaManager();
    } catch (error) {
      console.warn('⚠️  FluviaManager initialization failed:', error);
      throw new Error('FluviaManager not available - check environment variables');
    }
  }
  return fluviaManager;
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Railway healthcheck endpoint
app.get('/v1/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'fluvia-backend',
    version: '1.0.0',
    message: 'Service is running',
  });
});

// Fallback health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'fluvia-backend',
    version: '1.0.0',
    message: 'Service is running',
  });
});

// API routes
app.get('/api', authMiddleware({ requireAuth: true }), (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Fluvia API',
    version: '1.0.0',
  });
});

// Route that automatically creates user if missing
app.get(
  '/api/me',
  authMiddleware({ requireAuth: true }),
  userMiddleware.ensureUserExists,
  (req, res) => {
    const dbUser = userMiddleware.getDbUser(req);
    const wasCreated = userMiddleware.wasUserCreated(req);
    res.json({
      user: dbUser,
      created: wasCreated,
      message: wasCreated ? 'User created successfully' : 'User retrieved successfully',
    });
  }
);

// Get all Fluvia for the authenticated user
app.get('/api/fluvias', authMiddleware({ requireAuth: true }), (req: Request, res: Response) => {
  try {
    const manager = getFluviaManager();
    manager.getAllFluviaByUser(req, res);
  } catch (error) {
    res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'FluviaManager not available - check environment variables',
    });
  }
});

app.post('/api/fluvias', authMiddleware({ requireAuth: true }), (req: Request, res: Response) => {
  try {
    const manager = getFluviaManager();
    manager.createFluvia(req, res);
  } catch (error) {
    res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'FluviaManager not available - check environment variables',
    });
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: () => void) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server with database initialization
const startServer = async (): Promise<void> => {
  try {
    // Start server immediately so healthcheck is available
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/v1/healthcheck`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Healthcheck endpoint available at /v1/healthcheck`);
    });

    // Initialize database connection asynchronously
    try {
      const databaseService = DatabaseService.getInstance();
      const isConnected = await databaseService.testConnection(DBConfigurationType.MAIN);

      if (isConnected) {
        console.log(`🗄️  Database connected successfully`);
      } else {
        console.warn('⚠️  Database connection failed, but server is running');
      }
    } catch (dbError) {
      console.warn('⚠️  Database connection failed, but server is running:', dbError);
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
