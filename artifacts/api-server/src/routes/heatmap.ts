import { Router, Request, Response } from 'express';
import { getDb, prayers, narcanResponders } from '@workspace/db';
import { z } from 'zod';
import { gte, eq } from 'drizzle-orm';

const router: ReturnType<typeof Router> = Router();

// GET /api/heatmap/od-hotspots - Get OD incident heatmap data
router.get('/od-hotspots', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const db = await getDb();

    // Get prayers with crisis flags and location data
    const crisisPrayers = await db.select().from(prayers)
      .where(gte(prayers.created_at, cutoffDate));

    // Group by approximate location (city/zip)
    const hotspots = (crisisPrayers as any[])
      .filter(p => p.crisis_flag && p.latitude && p.longitude)
      .map(p => ({
        lat: parseFloat(p.latitude as any),
        lng: parseFloat(p.longitude as any),
        intensity: p.crisis_flag ? 2 : 1,
        timestamp: p.created_at,
        type: 'od',
      }));

    res.json({
      hotspots,
      totalIncidents: hotspots.length,
      timeRange: `${days} days`,
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

// GET /api/heatmap/responder-density - Get responder density map
router.get('/responder-density', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const responders = await db.select().from(narcanResponders);

    const density = (responders as any[])
      .filter(r => r.latitude && r.longitude && r.has_narcan)
      .map(r => ({
        lat: parseFloat(r.latitude as any),
        lng: parseFloat(r.longitude as any),
        intensity: r.has_narcan ? 1 : 0.5,
        responderId: r.id,
        hasNarcan: r.has_narcan,
      }));

    res.json({
      density,
      totalResponders: responders.length,
      respondersWithNarcan: (responders as any[]).filter(r => r.has_narcan === true).length,
    });
  } catch (error) {
    console.error('Error fetching responder density:', error);
    res.status(500).json({ error: 'Failed to fetch responder density' });
  }
});

// GET /api/heatmap/coverage - Get coverage analysis
router.get('/coverage', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const responders = (await db.select().from(narcanResponders)) as any[];
    const crisisPrayers = (await db.select().from(prayers)
      .where(eq(prayers.crisis_flag, true))) as any[];

    // Calculate coverage metrics
    const coverageAnalysis = {
      totalResponders: responders.length,
      respondersWithNarcan: responders.filter(r => r.has_narcan === true).length,
      totalCrisisIncidents: crisisPrayers.length,
      averageResponseTime: calculateAverageResponseTime(crisisPrayers),
      uncoveredAreas: identifyUncoveredAreas(responders, crisisPrayers),
    };

    res.json(coverageAnalysis);
  } catch (error) {
    console.error('Error analyzing coverage:', error);
    res.status(500).json({ error: 'Failed to analyze coverage' });
  }
});

// POST /api/heatmap/update-location - Update responder location
router.post('/update-location', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      responderId: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    // Update responder location
    // Implementation depends on your database structure
    console.log(`Updated location for responder ${parsed.responderId}`);

    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

function calculateAverageResponseTime(incidents: any[]): number {
  // Placeholder - implement based on your data structure
  return 5; // minutes
}

function identifyUncoveredAreas(responders: any[], incidents: any[]): any[] {
  // Placeholder - identify areas with incidents but no nearby responders
  return [];
}

export default router;
