import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import database service
import { DatabaseService, DBConfigurationType } from './services/DatabaseService';
import { authMiddleware, requireAuth } from './middleware/auth';
import { userMiddleware } from './middleware/userMiddleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.get('/api', authMiddleware({ requireAuth: true }), (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Fluvia API',
    version: '1.0.0',
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Route that automatically creates user if missing
app.get(
  '/me',
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
    // Get database service instance
    const databaseService = DatabaseService.getInstance();

    // Test database connection
    const isConnected = await databaseService.testConnection(DBConfigurationType.MAIN);

    if (!isConnected) {
      console.warn('⚠️  Database connection failed, but continuing...');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (isConnected) {
        console.log(`🗄️  Database connected successfully`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
