import { Router, Request, Response } from 'express';
import { getDb, auditLogs } from '@workspace/db';
import { desc, gte, eq } from 'drizzle-orm';
import { z } from 'zod';

const router: ReturnType<typeof Router> = Router();

// GET /api/audit-logs - Get all audit logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const adminEmail = req.query.adminEmail as string;
    const action = req.query.action as string;
    const entityType = req.query.entityType as string;

    const db = await getDb();
    let query: any = db.select().from(auditLogs);

    if (adminEmail) {
      query = query.where(eq(auditLogs.admin_email, adminEmail));
    }
    if (action) {
      query = query.where(eq(auditLogs.action, action));
    }
    if (entityType) {
      query = query.where(eq(auditLogs.entity_type, entityType));
    }

    const logs = await query
      .orderBy(desc(auditLogs.created_at))
      .limit(limit)
      .offset(offset);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit-logs/admin/:adminEmail - Get logs for specific admin
router.get('/admin/:adminEmail', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const logs = await db.select().from(auditLogs)
      .where(eq(auditLogs.admin_email, req.params.adminEmail))
      .orderBy(desc(auditLogs.created_at))
      .limit(50);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/audit-logs/entity/:entityType/:entityId - Get logs for specific entity
router.get('/entity/:entityType/:entityId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const logs = await db.select().from(auditLogs)
      .where(
        eq(auditLogs.entity_type, req.params.entityType)
      )
      .orderBy(desc(auditLogs.created_at));

    res.json(logs);
  } catch (error) {
    console.error('Error fetching entity logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/audit-logs/recent - Get recent audit logs
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const hoursAgo = parseInt(req.query.hours as string) || 24;
    const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const db = await getDb();
    const logs = await db.select().from(auditLogs)
      .where(gte(auditLogs.created_at, cutoffDate))
      .orderBy(desc(auditLogs.created_at))
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching recent logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/audit-logs/stats - Get audit statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allLogs = await db.select().from(auditLogs);

    const stats = {
      totalActions: allLogs.length,
      byAction: groupBy(allLogs, 'action'),
      byAdmin: groupBy(allLogs, 'admin_email'),
      byEntityType: groupBy(allLogs, 'entity_type'),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

function groupBy(items: any[], key: string): Record<string, number> {
  const grouped: Record<string, number> = {};
  items.forEach(item => {
    const value = item[key];
    grouped[value] = (grouped[value] || 0) + 1;
  });
  return grouped;
}

export default router;
