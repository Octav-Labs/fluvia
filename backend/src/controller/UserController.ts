import { Request, Response } from 'express';
import { UserFactory } from '../factories/UserFactory';

export class UserController {
  private userFactory: UserFactory;

  constructor() {
    this.userFactory = new UserFactory();
  }

  /**
   * Create a new user
   */
  async createUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      // Check if user already exists
      const existingUser = await this.userFactory.findByAddress(userId);

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'User with this address already exists',
          user: existingUser,
        });
      }

      // Create new user
      const newUser = await this.userFactory.create({
        address: userId,
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create user',
      });
    }
  }

  /**
   * Get user by address (userId)
   */
  async getUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      const user = await this.userFactory.findByAddress(userId);

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist',
        });
      }

      return res.json({
        user: user,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user',
      });
    }
  }

  /**
   * Get or create user (upsert)
   */
  async getOrCreateUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      // Try to get existing user
      let user = await this.userFactory.findByAddress(userId);

      // If user doesn't exist, create it
      if (!user) {
        user = await this.userFactory.create({
          address: userId,
        });
      }

      return res.json({
        user: user,
        created: !user.uuid || user.uuid === user.address, // Simple check for newly created user
      });
    } catch (error) {
      console.error('Error getting or creating user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get or create user',
      });
    }
  }

  /**
   * Update user
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated
      delete updateData.address;
      delete updateData.uuid;

      // Find user first
      const existingUser = await this.userFactory.findByAddress(userId);
      if (!existingUser) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist',
        });
      }

      // Update user
      const [updatedCount, updatedUsers] = await this.userFactory.update(
        { address: userId },
        updateData
      );

      if (updatedCount === 0) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist',
        });
      }

      return res.json({
        message: 'User updated successfully',
        user: updatedUsers[0],
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user',
      });
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      const deletedCount = await this.userFactory.delete({ address: userId });

      if (deletedCount === 0) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist',
        });
      }

      return res.json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete user',
      });
    }
  }
}
