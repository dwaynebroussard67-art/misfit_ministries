import Stripe from 'stripe';
import { db } from '../db/index.js';
import type { orders as OrdersTable } from '../db/schema/orders.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(
  userId: string,
  items: Array<{ priceId: string; quantity: number }>,
  userEmail: string,
  userName: string,
  origin: string,
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    mode: 'payment',
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      user_id: userId,
      customer_email: userEmail,
      customer_name: userName,
    },
    success_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/store`,
    allow_promotion_codes: true,
  });

  return session;
}

export async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  
  if (!session.client_reference_id || !session.payment_intent) {
    console.error('Missing required fields in checkout session');
    return;
  }

  const userId = session.client_reference_id;
  const paymentIntentId = typeof session.payment_intent === 'string' 
    ? session.payment_intent 
    : session.payment_intent.id;

  // Store order in database
  const { orders: ordersTable } = await import('../db/schema/orders');
  const { eq } = await import('drizzle-orm');
  await db.insert(ordersTable).values({
    user_id: userId,
    stripe_payment_intent_id: paymentIntentId,
    stripe_session_id: session.id,
    amount: session.amount_total || 0,
    currency: session.currency || 'usd',
    status: 'completed',
    customer_email: session.customer_email,
    metadata: JSON.stringify(session.metadata),
  });

  console.log(`Order created for user ${userId}, payment intent ${paymentIntentId}`);
}

export async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Update order status
  if (paymentIntent.id) {
    const { orders: ordersTable } = await import('../db/schema/orders');
    const { eq } = await import('drizzle-orm');
    await db.update(ordersTable)
      .set({ status: 'succeeded' })
      .where(eq(ordersTable.stripe_payment_intent_id, paymentIntent.id));
  }

  console.log(`Payment succeeded: ${paymentIntent.id}`);
}

export async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Update order status
  if (paymentIntent.id) {
    const { orders: ordersTable } = await import('../db/schema/orders');
    const { eq } = await import('drizzle-orm');
    await db.update(ordersTable)
      .set({ status: 'failed' })
      .where(eq(ordersTable.stripe_payment_intent_id, paymentIntent.id));
  }

  console.error(`Payment failed: ${paymentIntent.id}`);
}

export function verifyWebhookSignature(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

export async function getUserOrders(userId: string) {
  const { orders: ordersTable } = await import('../db/schema/orders');
  const { eq } = await import('drizzle-orm');
  return await db.select().from(ordersTable).where(eq(ordersTable.user_id, userId));
}
