import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateForgeToken, setForgeAuthCookie, clearForgeAuthCookie, verifyForgeToken } from '../middleware/forge-auth.js';
import { requireForge } from '../middleware/forge-auth.js';

const router: ReturnType<typeof Router> = Router();

const forgeAuthSchema = z.object({
  passphrase: z.string().min(1),
});

// POST /api/forge/auth - Verify passphrase and set HttpOnly cookie
router.post('/auth', async (req: Request, res: Response) => {
  try {
    const parsed = forgeAuthSchema.parse(req.body);
    const expectedPassphrase = process.env.FORGE_PASSPHRASE || '988';
    const secret = process.env.JWT_SECRET || 'default-secret';

    if (parsed.passphrase !== expectedPassphrase) {
      res.status(401).json({ error: 'Invalid passphrase' });
      return;
    }

    const token = generateForgeToken(parsed.passphrase, secret);
    setForgeAuthCookie(res, token);

    res.json({ success: true, message: 'Authenticated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error in Forge auth:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// POST /api/forge/logout - Clear HttpOnly cookie
router.post('/logout', requireForge, (req: Request, res: Response) => {
  clearForgeAuthCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/forge/verify - Verify current session
router.get('/verify', requireForge, (req: Request, res: Response) => {
  res.json({ authenticated: true });
});

export default router;
