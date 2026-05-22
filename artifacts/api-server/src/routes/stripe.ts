import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

const checkoutSchema = z.object({
  items: z.array(z.object({
    price_id: z.string(),
    quantity: z.number().default(1),
  })),
  success_url: z.string(),
  cancel_url: z.string(),
});

// POST /api/stripe/checkout - Create checkout session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const parsed = checkoutSchema.parse(req.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: parsed.items.map(item => ({
        price: item.price_id,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: parsed.success_url,
      cancel_url: parsed.cancel_url,
    });

    res.json({ session_id: session.id, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// GET /api/stripe/products - List products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    res.json(products.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/stripe/webhook - Handle webhook events
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
