import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  sendOrderConfirmation,
  sendCrisisAlert,
  sendShipmentNotification,
} from '../utils/email-service.js';

const router = Router();

// POST /api/email/order-confirmation - Send order confirmation email
router.post('/order-confirmation', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      customerEmail: z.string().email(),
      orderId: z.string(),
      amount: z.number(),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.number(),
          price: z.number(),
        })
      ),
    });

    const parsed = schema.parse(req.body);

    await sendOrderConfirmation(
      parsed.customerEmail,
      parsed.orderId,
      parsed.amount,
      parsed.items
    );

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error sending order confirmation:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST /api/email/crisis-alert - Send crisis alert email
router.post('/crisis-alert', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      adminEmail: z.string().email(),
      prayerName: z.string(),
      keywords: z.array(z.string()),
    });

    const parsed = schema.parse(req.body);

    await sendCrisisAlert(parsed.adminEmail, parsed.prayerName, parsed.keywords);

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error sending crisis alert:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST /api/email/shipment-notification - Send shipment notification email
router.post('/shipment-notification', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      adminEmail: z.string().email(),
      shipmentId: z.string(),
      quantity: z.number(),
      location: z.string(),
      trackingNumber: z.string().optional(),
    });

    const parsed = schema.parse(req.body);

    await sendShipmentNotification(
      parsed.adminEmail,
      parsed.shipmentId,
      parsed.quantity,
      parsed.location,
      parsed.trackingNumber
    );

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error sending shipment notification:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;

