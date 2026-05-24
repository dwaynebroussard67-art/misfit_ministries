import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware: Verify JWT token from Authorization header
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware: Require admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return;
  }

  next();
}

/**
 * Middleware: Require admin or moderator role
 */
export function requireAdminOrModerator(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    res.status(403).json({ error: 'Forbidden: Admin or moderator access required' });
    return;
  }

  next();
}

/**
 * Middleware: Optional auth (attach user if token provided)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}
