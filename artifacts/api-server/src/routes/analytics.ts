import { Router, Request, Response } from 'express';
import { getDb, prayers, testimonies, orders, narcanResponders, narcanShipments } from '@workspace/db';
import { count, eq, gte } from 'drizzle-orm';

const router: ReturnType<typeof Router> = Router();

// GET /api/analytics/dashboard - Get all dashboard stats
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Prayer stats
    const totalPrayers = await db.select({ count: count() }).from(prayers);
    const prayersThisMonth = await db.select({ count: count() }).from(prayers)
      .where(gte(prayers.created_at, thirtyDaysAgo));
    const crisisPrayers = await db.select({ count: count() }).from(prayers)
      .where(eq(prayers.crisis_flag, true));

    // Testimony stats
    const totalTestimonies = await db.select({ count: count() }).from(testimonies);
    const testimoniesThisMonth = await db.select({ count: count() }).from(testimonies)
      .where(gte(testimonies.created_at, thirtyDaysAgo));
    const approvedTestimonies = await db.select({ count: count() }).from(testimonies)
      .where(eq(testimonies.approved, true));

    // Order stats
    const totalOrders = await db.select({ count: count() }).from(orders);
    const ordersThisMonth = await db.select({ count: count() }).from(orders)
      .where(gte(orders.created_at, thirtyDaysAgo));
    const totalRevenue = await db.select({ total: count() }).from(orders);

    // Responder stats
    const totalResponders = await db.select({ count: count() }).from(narcanResponders);
    const activeResponders = await db.select({ count: count() }).from(narcanResponders)
      .where(eq(narcanResponders.is_active, true));

    // Narcan stats
    const totalShipments = await db.select({ count: count() }).from(narcanShipments);
    const totalNarcanKits = await db.select({ count: count() }).from(narcanShipments);

    res.json({
      prayers: {
        total: totalPrayers[0]?.count || 0,
        thisMonth: prayersThisMonth[0]?.count || 0,
        crisis: crisisPrayers[0]?.count || 0,
      },
      testimonies: {
        total: totalTestimonies[0]?.count || 0,
        thisMonth: testimoniesThisMonth[0]?.count || 0,
        approved: approvedTestimonies[0]?.count || 0,
      },
      orders: {
        total: totalOrders[0]?.count || 0,
        thisMonth: ordersThisMonth[0]?.count || 0,
        revenue: totalRevenue[0]?.total || 0,
      },
      responders: {
        total: totalResponders[0]?.count || 0,
        active: activeResponders[0]?.count || 0,
      },
      narcan: {
        totalShipments: totalShipments[0]?.count || 0,
        totalKits: totalNarcanKits[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/prayers - Prayer analytics
router.get('/prayers', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allPrayers = await db.select().from(prayers);

    const stats = {
      total: allPrayers.length,
      crisis: allPrayers.filter(p => p.crisis_flag).length,
      byDay: groupByDay(allPrayers),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching prayer analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/store - Store sales analytics
router.get('/store', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allOrders = await db.select().from(orders);

    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const averageOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

    const stats = {
      totalOrders: allOrders.length,
      totalRevenue,
      averageOrderValue,
      byDay: groupByDay(allOrders),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching store analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/narcan - Narcan distribution analytics
router.get('/narcan', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const shipments = await db.select().from(narcanShipments);
    const responders = await db.select().from(narcanResponders);

    const totalKits = shipments.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const distributedKits = shipments
      .filter(s => s.status === 'distributed')
      .reduce((sum, s) => sum + (s.quantity || 0), 0);

    const stats = {
      totalShipments: shipments.length,
      totalKits,
      distributedKits,
      pendingKits: totalKits - distributedKits,
      totalResponders: responders.length,
      activeResponders: responders.filter(r => r.is_active).length,
      totalSaves: responders.reduce((sum, r) => sum + (r.saves_count || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching Narcan analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

function groupByDay(items: any[]): Record<string, number> {
  const grouped: Record<string, number> = {};

  items.forEach(item => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return grouped;
}

export default router;
