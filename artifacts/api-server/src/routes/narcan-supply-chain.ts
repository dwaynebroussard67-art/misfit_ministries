import { Router, Request, Response } from 'express';
import { getDb, narcanShipments, narcanDistribution } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router: ReturnType<typeof Router> = Router();

const createShipmentSchema = z.object({
  source: z.enum(['government', 'donation', 'purchase']),
  quantity: z.number().min(1),
  origin_location: z.string(),
  destination_location: z.string(),
  tracking_number: z.string().optional(),
  expected_arrival: z.string().optional(),
});

const updateShipmentSchema = z.object({
  status: z.enum(['pending', 'in_transit', 'received', 'distributed']).optional(),
  actual_arrival: z.string().optional(),
  tracking_number: z.string().optional(),
});

// GET /api/narcan/supply-chain/shipments - List all shipments
router.get('/shipments', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const shipments = await db.select().from(narcanShipments)
      .orderBy(desc(narcanShipments.created_at));

    const stats = {
      total_shipments: shipments.length,
      pending: shipments.filter(s => s.status === 'pending').length,
      in_transit: shipments.filter(s => s.status === 'in_transit').length,
      received: shipments.filter(s => s.status === 'received').length,
      distributed: shipments.filter(s => s.status === 'distributed').length,
      total_kits: shipments.reduce((sum, s) => sum + (s.quantity || 0), 0),
    };

    res.json({ stats, shipments });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// POST /api/narcan/supply-chain/shipments - Create new shipment
router.post('/shipments', async (req: Request, res: Response) => {
  try {
    const parsed = createShipmentSchema.parse(req.body);
    const db = await getDb();

    const result = await db.insert(narcanShipments).values({
      shipment_id: `SHIP-${Date.now()}`,
      source: parsed.source,
      quantity: parsed.quantity,
      origin_location: parsed.origin_location,
      destination_location: parsed.destination_location,
      tracking_number: parsed.tracking_number,
      expected_arrival: parsed.expected_arrival ? new Date(parsed.expected_arrival) : undefined,
      status: 'pending',
    });

    res.status(201).json({ success: true, shipment_id: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// PATCH /api/narcan/supply-chain/shipments/:id - Update shipment
router.patch('/shipments/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateShipmentSchema.parse(req.body);
    const db = await getDb();

    const updateData: any = { ...parsed };
    if (parsed.actual_arrival) {
      updateData.actual_arrival = new Date(parsed.actual_arrival);
    }

    await db.update(narcanShipments).set(updateData)
      .where(eq(narcanShipments.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// POST /api/narcan/supply-chain/distribute - Distribute Narcan to responders
router.post('/distribute', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      shipment_id: z.number(),
      responder_id: z.number(),
      quantity: z.number().min(1),
      pickup_location: z.string().optional(),
    });
    const parsed = schema.parse(req.body);
    const db = await getDb();

    await db.insert(narcanDistribution).values({
      shipment_id: parsed.shipment_id,
      responder_id: parsed.responder_id,
      quantity_distributed: parsed.quantity,
      pickup_location: parsed.pickup_location,
      distribution_date: new Date(),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error distributing Narcan:', error);
    res.status(500).json({ error: 'Failed to distribute Narcan' });
  }
});

// GET /api/narcan/supply-chain/distribution/:shipmentId - Get distribution for shipment
router.get('/distribution/:shipmentId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const distributions = await db.select().from(narcanDistribution)
      .where(eq(narcanDistribution.shipment_id, parseInt(req.params.shipmentId)));

    res.json(distributions);
  } catch (error) {
    console.error('Error fetching distributions:', error);
    res.status(500).json({ error: 'Failed to fetch distributions' });
  }
});

export default router;
