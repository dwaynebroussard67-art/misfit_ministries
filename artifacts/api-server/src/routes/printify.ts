import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import axios from 'axios';

const router: ExpressRouter = Router();
const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const PRINTIFY_TOKEN = process.env.PRINTIFY_JWT_TOKEN || '';

// Get products
router.get('/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${PRINTIFY_API_URL}/shops`, {
      headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Printify error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
