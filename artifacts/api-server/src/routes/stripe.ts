import { Router, Request, Response } from 'express';
import { createCheckoutSession, verifyWebhookSignature, handleCheckoutSessionCompleted, handlePaymentIntentSucceeded, handlePaymentIntentFailed, getUserOrders } from '../services/stripe-service';
import { PRODUCTS, MERCHANDISE } from '../config/products';
import { forgeAuth } from '../middleware/forge-auth';

const router = Router();

// Create checkout session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    const session = await createCheckoutSession(
      user.id,
      items,
      user.email || 'customer@example.com',
      user.name || 'Customer',
      req.headers.origin || 'http://localhost:5173',
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get user orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await getUserOrders(user.id);
    res.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Webhook endpoint
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = verifyWebhookSignature(JSON.stringify(req.body), sig);

    // Handle test events
    if (event.id.startsWith('evt_test_')) {
      console.log('[Webhook] Test event detected:', event.type);
      return res.json({ verified: true });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

// Get products (public)
router.get('/products', (req: Request, res: Response) => {
  res.json({ products: PRODUCTS, merchandise: MERCHANDISE });
});

export default router;
