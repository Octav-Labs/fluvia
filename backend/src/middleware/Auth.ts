import { Request, Response, NextFunction } from 'express';
import { PrivyClient } from '@privy-io/server-auth';

// Initialize Privy client
const privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        appId: string;
        issuer: string;
        issuedAt: string;
        expiration: string;
        sessionId: string;
      };
    }
  }
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  optional?: boolean;
}

/**
 * Middleware to verify Privy access tokens
 * @param options - Middleware options
 * @param options.requireAuth - If true, returns 401 when no token is provided (default: true)
 * @param options.optional - If true, continues without user data if token is invalid (default: false)
 */
export const authMiddleware = (options: AuthMiddlewareOptions = {}) => {
  const { requireAuth = true, optional = false } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      let accessToken: string | undefined;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
      }

      // If no token provided
      if (!accessToken) {
        if (requireAuth) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Access token is required',
          });
        }
        return next();
      }

      // Verify the token
      try {
        const verifiedClaims = await privy.verifyAuthToken(accessToken);

        // Add user information to request
        req.user = {
          userId: verifiedClaims.userId,
          appId: verifiedClaims.appId,
          issuer: verifiedClaims.issuer,
          issuedAt: verifiedClaims.issuedAt.toString(),
          expiration: verifiedClaims.expiration.toString(),
          sessionId: verifiedClaims.sessionId,
        };

        next();
      } catch (error) {
        if (optional) {
          // Continue without user data
          return next();
        }

        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired access token',
        });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication service error',
      });
    }
  };
};

/**
 * Middleware that requires authentication
 */
export const requireAuth = authMiddleware({ requireAuth: true });

/**
 * Middleware that makes authentication optional
 */
export const optionalAuth = authMiddleware({ requireAuth: false, optional: true });

/**
 * Helper function to get user from request
 */
export const getUser = (req: Request) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  return req.user;
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = (req: Request): boolean => {
  return !!req.user;
};
