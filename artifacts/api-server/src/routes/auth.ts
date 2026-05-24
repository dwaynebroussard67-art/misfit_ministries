import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/user-service.js';
import { generateToken, requireAuth, requireAdmin } from '../middleware/auth.js';

const router: ReturnType<typeof Router> = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'moderator', 'user']).optional(),
  isActive: z.boolean().optional(),
});

/**
 * POST /api/auth/register - Register new user (admin only)
 */
router.post('/register', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);

    // Check if user already exists
    const existing = await UserService.findByEmail(parsed.email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = await UserService.createUser({
      email: parsed.email,
      password: parsed.password,
      name: parsed.name,
      role: 'user',
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login - Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await UserService.findByEmail(parsed.email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.isActive !== 'true') {
      res.status(403).json({ error: 'Account is deactivated' });
      return;
    }

    const isPasswordValid = await UserService.verifyPassword(parsed.password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update last login
    await UserService.updateLastLogin(user.id);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'admin' | 'moderator' | 'user',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me - Get current user profile
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await UserService.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * GET /api/auth/users - List all users (admin only)
 */
router.get('/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const allUsers = await UserService.getAllUsers();
    res.json({
      users: allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive === 'true',
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * PATCH /api/auth/users/:userId - Update user (admin only)
 */
router.patch('/users/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = updateUserSchema.parse(req.body);
    const updated = await UserService.updateUser(req.params.userId, parsed);

    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/auth/users/:userId - Deactivate user (admin only)
 */
router.delete('/users/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    await UserService.deactivateUser(req.params.userId);
    res.json({ success: true, message: 'User deactivated' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

export default router;
