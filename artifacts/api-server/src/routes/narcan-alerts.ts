import { Router, Request, Response } from 'express';
import { getDb, odAlerts, odResponses, narcanResponders } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { findClosestResponders, isAlertExpired, sanitizeLocationForLogging } from '../utils/privacy-location.js';

const router: ReturnType<typeof Router> = Router();

const odAlertSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  location_description: z.string().optional(),
  responder_locations: z.array(z.object({
    responderId: z.number(),
    lat: z.number(),
    lng: z.number(),
  })).optional(),
});

const respondToAlertSchema = z.object({
  responder_id: z.number(),
  distance_miles: z.number(),
  eta_seconds: z.number(),
});

// POST /api/narcan/alert - Submit OD alert (PRIVACY-FIRST)
router.post('/alert', async (req: Request, res: Response) => {
  try {
    const parsed = odAlertSchema.parse(req.body);
    const db = await getDb();

    // Create alert with victim location
    const result = await db.insert(odAlerts).values({
      lat: parsed.lat,
      lng: parsed.lng,
      location_description: parsed.location_description,
      status: 'active',
    });

    // Find closest responders (server-side calculation)
    // Responder locations are NEVER stored - only used for distance calculation
    const closestResponders = parsed.responder_locations
      ? findClosestResponders(parsed.lat, parsed.lng, parsed.responder_locations, 5)
      : [];

    console.log(`OD Alert created at ${sanitizeLocationForLogging(parsed.lat, parsed.lng)}`);
    console.log(`${closestResponders.length} responders within 5 miles`);

    res.status(201).json({
      success: true,
      alert_id: result.insertId,
      closest_responders_count: closestResponders.length,
      message: 'Help is on the way. Stay with me.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating OD alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// POST /api/narcan/respond - Responder accepts alert
router.post('/respond', async (req: Request, res: Response) => {
  try {
    const parsed = respondToAlertSchema.parse(req.body);
    const db = await getDb();

    // Create response record
    await db.insert(odResponses).values({
      alert_id: 0, // Will be set by client
      responder_id: parsed.responder_id,
      status: 'responding',
      distance_miles: parsed.distance_miles,
      eta_seconds: parsed.eta_seconds,
    });

    // Update responder last location update
    await db.update(narcanResponders).set({
      last_location_update: new Date(),
    }).where(eq(narcanResponders.id, parsed.responder_id));

    res.json({ success: true, message: 'Response recorded' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error recording response:', error);
    res.status(500).json({ error: 'Failed to record response' });
  }
});

// PATCH /api/narcan/alert/:id/resolve - Mark alert resolved
router.patch('/alert/:id/resolve', async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.id);
    const db = await getDb();

    // Mark alert as resolved
    await db.update(odAlerts).set({
      status: 'resolved',
      resolved_at: new Date(),
    }).where(eq(odAlerts.id, alertId));

    // Delete all location data associated with this alert
    // (Privacy-first: no permanent location history)
    console.log(`OD Alert ${alertId} resolved. Location data cleared.`);

    res.json({ success: true, message: 'Alert resolved. Location data cleared.' });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// GET /api/narcan/active-alerts - Get active alerts (responders only)
router.get('/active-alerts', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const alerts = await db.select().from(odAlerts)
      .where(eq(odAlerts.status, 'active'))
      .orderBy(desc(odAlerts.created_at));

    // Only return alerts created in last 30 minutes
    const activeAlerts = alerts.filter(a => !isAlertExpired(a.created_at, 30));

    res.json(activeAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
