import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { getDb, orders } from '@workspace/db';
import { createOrder } from '../utils/printify-client.js';

const router: ReturnType<typeof Router> = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '1';

// POST /api/stripe/webhook - Handle Stripe events
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    res.status(500).json({ error: 'Webhook not configured' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  // Get session details
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items'],
  });

  // Extract order data from session metadata
  const metadata = fullSession.metadata || {};
  const items = fullSession.line_items?.data || [];

  // Create Printify order
  const printifyOrderData = {
    external_id: session.id,
    line_items: items.map((item: any) => ({
      product_id: item.price?.product as string,
      variant_id: metadata.variant_id || '1',
      quantity: item.quantity || 1,
    })),
    shipping_method: 1, // Standard shipping
    send_shipping_notification: true,
  };

  try {
    const printifyOrder = await createOrder(PRINTIFY_SHOP_ID, printifyOrderData);
    console.log('Printify order created:', printifyOrder.id);

    // Store order in database
    const db = await getDb();
    await db.insert(orders).values({
      stripe_session_id: session.id,
      printify_order_id: printifyOrder.id,
      customer_email: fullSession.customer_email || '',
      amount: fullSession.amount_total || 0,
      status: 'completed',
    });

    // Send confirmation email (implement with email service)
    console.log('Order confirmation would be sent to:', fullSession.customer_email);
  } catch (error) {
    console.error('Error creating Printify order:', error);
    throw error;
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log('Charge succeeded:', charge.id);
  // Additional logic for successful charges
}

async function handleChargeFailed(charge: Stripe.Charge) {
  console.log('Charge failed:', charge.id);
  // Send failure notification to customer
}

export default router;
