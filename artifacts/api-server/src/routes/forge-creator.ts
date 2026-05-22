import { Router, Request, Response } from 'express';
import { getDb, forgePages, forgePageBlocks, forgeStorefronts, forgeStorefrontProducts } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// POST /api/forge-creator/pages - Create new page
router.post('/pages', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string().optional(),
      createdBy: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    const result = await db.insert(forgePages).values({
      slug: parsed.slug,
      title: parsed.title,
      description: parsed.description,
      created_by: parsed.createdBy,
    });

    res.json({
      success: true,
      pageId: result.insertId,
      message: 'Page created',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// GET /api/forge-creator/pages - Get all pages
router.get('/pages', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const pages = await db.select().from(forgePages)
      .orderBy(desc(forgePages.updated_at));

    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET /api/forge-creator/pages/:id - Get single page with blocks
router.get('/pages/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const page = await db.select().from(forgePages)
      .where(eq(forgePages.id, parseInt(req.params.id)));

    if (page.length === 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const blocks = await db.select().from(forgePageBlocks)
      .where(eq(forgePageBlocks.page_id, parseInt(req.params.id)))
      .orderBy(forgePageBlocks.order);

    res.json({
      ...page[0],
      blocks,
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// POST /api/forge-creator/pages/:id/blocks - Add block to page
router.post('/pages/:id/blocks', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      type: z.string(),
      content: z.record(z.any()),
      order: z.number().optional(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    const result = await db.insert(forgePageBlocks).values({
      page_id: parseInt(req.params.id),
      type: parsed.type,
      content: parsed.content,
      order: parsed.order || 0,
    });

    res.json({
      success: true,
      blockId: result.insertId,
      message: 'Block added',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error adding block:', error);
    res.status(500).json({ error: 'Failed to add block' });
  }
});

// PATCH /api/forge-creator/pages/:id/blocks/:blockId - Update block
router.patch('/pages/:id/blocks/:blockId', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      content: z.record(z.any()).optional(),
      order: z.number().optional(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    const updateData: any = {};
    if (parsed.content) updateData.content = parsed.content;
    if (parsed.order !== undefined) updateData.order = parsed.order;

    await db.update(forgePageBlocks)
      .set(updateData)
      .where(eq(forgePageBlocks.id, parseInt(req.params.blockId)));

    res.json({ success: true, message: 'Block updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// DELETE /api/forge-creator/pages/:id/blocks/:blockId - Delete block
router.delete('/pages/:id/blocks/:blockId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    await db.delete(forgePageBlocks)
      .where(eq(forgePageBlocks.id, parseInt(req.params.blockId)));

    res.json({ success: true, message: 'Block deleted' });
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

// POST /api/forge-creator/pages/:id/publish - Publish page
router.post('/pages/:id/publish', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    await db.update(forgePages)
      .set({
        is_published: true,
        published_at: new Date(),
      })
      .where(eq(forgePages.id, parseInt(req.params.id)));

    res.json({ success: true, message: 'Page published' });
  } catch (error) {
    console.error('Error publishing page:', error);
    res.status(500).json({ error: 'Failed to publish page' });
  }
});

// POST /api/forge-creator/storefronts - Create storefront
router.post('/storefronts', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      name: z.string(),
      description: z.string().optional(),
      layout: z.enum(['grid', 'carousel', 'featured']).optional(),
      createdBy: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    const result = await db.insert(forgeStorefronts).values({
      name: parsed.name,
      description: parsed.description,
      layout: parsed.layout || 'grid',
      created_by: parsed.createdBy,
    });

    res.json({
      success: true,
      storefrontId: result.insertId,
      message: 'Storefront created',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating storefront:', error);
    res.status(500).json({ error: 'Failed to create storefront' });
  }
});

// GET /api/forge-creator/storefronts - Get all storefronts
router.get('/storefronts', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const storefronts = await db.select().from(forgeStorefronts)
      .orderBy(desc(forgeStorefronts.updated_at));

    res.json(storefronts);
  } catch (error) {
    console.error('Error fetching storefronts:', error);
    res.status(500).json({ error: 'Failed to fetch storefronts' });
  }
});

// POST /api/forge-creator/storefronts/:id/products - Add product to storefront
router.post('/storefronts/:id/products', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      productId: z.string(),
      displayOrder: z.number().optional(),
      featured: z.boolean().optional(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    const result = await db.insert(forgeStorefrontProducts).values({
      storefront_id: parseInt(req.params.id),
      product_id: parsed.productId,
      display_order: parsed.displayOrder || 0,
      featured: parsed.featured || false,
    });

    res.json({
      success: true,
      productId: result.insertId,
      message: 'Product added to storefront',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

export default router;
