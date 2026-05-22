import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const FORGE_TOKEN_COOKIE = 'forge_vault_token';
const TOKEN_TTL = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

export function generateForgeToken(passphrase: string, secret: string): string {
  const combined = `${passphrase}${secret}forge`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function verifyForgeToken(token: string, passphrase: string, secret: string): boolean {
  const expected = generateForgeToken(passphrase, secret);
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function setForgeAuthCookie(res: Response, token: string): void {
  res.cookie(FORGE_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_TTL,
    path: '/',
  });
}

export function clearForgeAuthCookie(res: Response): void {
  res.clearCookie(FORGE_TOKEN_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

export function requireForge(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies[FORGE_TOKEN_COOKIE] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No Forge token' });
    return;
  }

  try {
    const passphrase = process.env.FORGE_PASSPHRASE || '988';
    const secret = process.env.JWT_SECRET || 'default-secret';

    if (verifyForgeToken(token, passphrase, secret)) {
      (req as any).isForge = true;
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
}
