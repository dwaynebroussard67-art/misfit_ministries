import { Router, Request, Response } from 'express';
import { getDb, siteCopy } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router = Router();

const SITE_COPY_DEFAULTS: Record<string, string> = {
  'home.hero.eyebrow': 'WELCOME TO MISFIT MINISTRIES',
  'home.hero.heading': 'A Beacon for Humanity',
  'home.hero.subheading': 'Jesus Christ is the answer',
  'home.hero.cta': 'Talk to Nura',
  'home.community.heading': 'A Hospital for the Broken',
  'home.community.description': 'We are a community for people who have been written off.',
  'about.heading': 'About Misfit Ministries',
  'about.description': 'We exist to give a theological home to people who have been written off.',
  'prayer.heading': 'Prayer Wall',
  'prayer.description': 'Submit your prayer request and let our community pray with you.',
  'testimony.heading': 'Testimony Wall',
  'testimony.description': 'Share your story of redemption and transformation.',
  'wreckage.heading': 'The Wreckage',
  'wreckage.description': 'Crisis resources and support available 24/7.',
  'armory.heading': 'The Armory',
  'armory.description': 'Articles, teachings, and resources for your spiritual journey.',
  'nura.heading': 'Talk to Nura',
  'nura.description': 'A motherly AI companion grounded in Ethiopian Orthodox theology.',
  'constitution.heading': 'The Constitution',
  'constitution.description': 'Nura\'s District Rules — how she operates.',
};

// GET /api/site-copy - Get all site copy with defaults
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const overrides = await db.select().from(siteCopy);

    const result: Record<string, string> = { ...SITE_COPY_DEFAULTS };
    for (const override of overrides) {
      result[override.key] = override.value;
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching site copy:', error);
    res.status(500).json({ error: 'Failed to fetch site copy' });
  }
});

// PUT /api/site-copy/:key - Update site copy (Forge only)
router.put('/:key', requireForge, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== 'string') {
      res.status(400).json({ error: 'Value must be a non-empty string' });
      return;
    }

    const db = await getDb();
    const existing = await db.select().from(siteCopy).where(eq(siteCopy.key, key));

    if (existing.length > 0) {
      await db.update(siteCopy).set({ value }).where(eq(siteCopy.key, key));
    } else {
      await db.insert(siteCopy).values({
        key,
        value,
        description: `Override for ${key}`,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating site copy:', error);
    res.status(500).json({ error: 'Failed to update site copy' });
  }
});

// DELETE /api/site-copy/:key - Reset to default (Forge only)
router.delete('/:key', requireForge, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const db = await getDb();

    await db.delete(siteCopy).where(eq(siteCopy.key, key));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting site copy:', error);
    res.status(500).json({ error: 'Failed to delete site copy' });
  }
});

export default router;
