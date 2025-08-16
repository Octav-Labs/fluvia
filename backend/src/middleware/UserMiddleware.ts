import { Request, Response, NextFunction } from 'express';
import { mapRecordToUser, UserFactory } from '../factories/UserFactory';
import { UserRecord } from '../models/interfaces';

export class UserMiddleware {
  private userFactory: UserFactory;

  constructor() {
    this.userFactory = new UserFactory();
  }

  /**
   * Middleware to ensure user exists in database
   * Creates user if they don't exist
   */
  ensureUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      const { userId } = req.user;
      console.log(req.user, 'user');
      // Check if user exists in database
      let user = await this.userFactory.findByPrivyUserId(userId);

      // If user doesn't exist, create them
      if (!user) {
        const userRecord = await this.userFactory.create({ privy_user_id: userId });
        user = mapRecordToUser(userRecord);

        // Add user to request object
        (req as any).dbUser = user;
        (req as any).userCreated = true;
      } else {
        // Add existing user to request object
        (req as any).dbUser = user;
        (req as any).userCreated = false;
      }

      next();
    } catch (error) {
      console.error('Error in ensureUserExists middleware:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to ensure user exists',
      });
      return;
    }
  };

  /**
   * Middleware to get user from database (doesn't create if missing)
   */
  getUserFromDb = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      const { userId } = req.user;

      // Get user from database
      const user = await this.userFactory.findByPrivyUserId(userId);

      if (!user) {
        res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
        return;
      }

      // Add user to request object
      (req as any).dbUser = user;
      next();
    } catch (error) {
      console.error('Error in getUserFromDb middleware:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user from database',
      });
      return;
    }
  };

  /**
   * Helper function to get database user from request
   */
  getDbUser(req: Request) {
    const dbUser = (req as any).dbUser;
    if (!dbUser) {
      throw new Error('Database user not found in request');
    }
    return dbUser;
  }

  /**
   * Helper function to check if user was created in this request
   */
  wasUserCreated(req: Request): boolean {
    return (req as any).userCreated === true;
  }
}

// Export middleware instance
export const userMiddleware = new UserMiddleware();
