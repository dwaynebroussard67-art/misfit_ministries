import { Router, Request, Response } from 'express';
import { subscribeToAlerts } from '../utils/alert-broadcaster.js';

const router: ReturnType<typeof Router> = Router();

// GET /api/narcan/subscribe - Subscribe to real-time OD alerts
router.get('/subscribe', (req: Request, res: Response) => {
  const responderId = parseInt(req.query.responderId as string);
  const city = req.query.city as string;

  if (!responderId) {
    res.status(400).json({ error: 'responderId required' });
    return;
  }

  subscribeToAlerts(res, responderId, city);
});

export default router;
