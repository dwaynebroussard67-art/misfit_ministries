import { Router, Request, Response } from 'express';
import { subscribeToNotifications } from '../utils/notification-manager.js';

const router = Router();

// GET /api/notifications/subscribe - Subscribe to real-time notifications
router.get('/subscribe', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const role = (req.query.role as string) || 'moderator';

  if (!userId) {
    res.status(400).json({ error: 'userId required' });
    return;
  }

  if (role !== 'admin' && role !== 'moderator') {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  subscribeToNotifications(res, userId, role as 'admin' | 'moderator');
});

export default router;
