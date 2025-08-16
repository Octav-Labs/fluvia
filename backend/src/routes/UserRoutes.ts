import { Router } from 'express';
import { UserController } from '../controller/UserController';

import { userMiddleware } from '../middleware/UserMiddleware';
import { authMiddleware } from '../middleware/Auth';

const router: Router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authMiddleware({ requireAuth: true }));

// Route that ensures user exists (creates if missing)
router.get('/me', userMiddleware.ensureUserExists, (req, res) => {
  const dbUser = userMiddleware.getDbUser(req);
  const wasCreated = userMiddleware.wasUserCreated(req);

  res.json({
    user: dbUser,
    created: wasCreated,
    message: wasCreated ? 'User created successfully' : 'User retrieved successfully',
  });
});

// Route that requires user to exist (doesn't create)
router.get('/profile', userMiddleware.getUserFromDb, (req, res) => {
  const dbUser = userMiddleware.getDbUser(req);

  res.json({
    user: dbUser,
    message: 'User profile retrieved',
  });
});

// Create user explicitly
router.post('/', userController.createUser.bind(userController));

// Get user (requires user to exist)
router.get('/', userMiddleware.getUserFromDb, userController.getUser.bind(userController));

// Get or create user
router.get('/get-or-create', userController.getOrCreateUser.bind(userController));

// Update user (requires user to exist)
router.put('/', userMiddleware.getUserFromDb, userController.updateUser.bind(userController));

// Delete user (requires user to exist)
router.delete('/', userMiddleware.getUserFromDb, userController.deleteUser.bind(userController));

export default router;
