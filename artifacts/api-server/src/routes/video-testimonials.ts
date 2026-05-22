import { Router, Request, Response } from 'express';
import { getDb, videoTestimonials, videoUploadSessions } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';

const router: ReturnType<typeof Router> = Router();

// POST /api/video-testimonials/initiate-upload - Start video upload session
router.post('/initiate-upload', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.string(),
      fileName: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();
    const uploadToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(videoUploadSessions).values({
      user_id: parsed.userId,
      upload_token: uploadToken,
      file_name: parsed.fileName,
      file_size: parsed.fileSize,
      mime_type: parsed.mimeType,
      expires_at: expiresAt,
    });

    res.json({
      uploadToken,
      expiresAt,
      message: 'Upload session created',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error initiating upload:', error);
    res.status(500).json({ error: 'Failed to initiate upload' });
  }
});

// POST /api/video-testimonials - Submit video testimonial
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      uploadToken: z.string(),
      userId: z.string(),
      userName: z.string().optional(),
      title: z.string(),
      description: z.string(),
      videoUrl: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      durationSeconds: z.number(),
      isAnonymous: z.boolean().default(false),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    // Verify upload session
    const session = await db.select().from(videoUploadSessions)
      .where(eq(videoUploadSessions.upload_token, parsed.uploadToken));

    if (session.length === 0) {
      res.status(400).json({ error: 'Invalid upload token' });
      return;
    }

    // Create testimonial
    const result: any = await db.insert(videoTestimonials).values({
      user_id: parsed.userId,
      user_name: parsed.isAnonymous ? 'Anonymous' : parsed.userName,
      video_url: parsed.videoUrl,
      thumbnail_url: parsed.thumbnailUrl,
      title: parsed.title,
      description: parsed.description,
      duration_seconds: parsed.durationSeconds,
      is_anonymous: parsed.isAnonymous,
      status: 'pending',
    });

    res.json({
      success: true,
      testimonialId: result.insertId as number,
      message: 'Testimonial submitted for moderation',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

// GET /api/video-testimonials - Get published testimonials
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const db = await getDb();
    const testimonials = await db.select().from(videoTestimonials)
      .where(eq(videoTestimonials.status, 'approved'))
      .orderBy(desc(videoTestimonials.published_at))
      .limit(limit)
      .offset(offset);

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// GET /api/video-testimonials/:id - Get single testimonial
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const testimonial = await db.select().from(videoTestimonials)
      .where(eq(videoTestimonials.id, parseInt(req.params.id)));

    if (testimonial.length === 0) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Increment view count
    await db.update(videoTestimonials)
      .set({ view_count: (testimonial[0].view_count || 0) + 1 })
      .where(eq(videoTestimonials.id, parseInt(req.params.id)));

    res.json(testimonial[0]);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

// POST /api/video-testimonials/:id/approve - Approve testimonial (ADMIN)
router.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      adminId: z.string(),
      adminEmail: z.string().email(),
      moderationNotes: z.string().optional(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    await db.update(videoTestimonials)
      .set({
        status: 'approved',
        moderated_by: parsed.adminEmail,
        moderation_notes: parsed.moderationNotes,
        moderated_at: new Date(),
        published_at: new Date(),
      })
      .where(eq(videoTestimonials.id, parseInt(req.params.id)));

    res.json({ success: true, message: 'Testimonial approved' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error approving testimonial:', error);
    res.status(500).json({ error: 'Failed to approve testimonial' });
  }
});

// POST /api/video-testimonials/:id/reject - Reject testimonial (ADMIN)
router.post('/:id/reject', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      adminId: z.string(),
      adminEmail: z.string().email(),
      reason: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    await db.update(videoTestimonials)
      .set({
        status: 'rejected',
        moderated_by: parsed.adminEmail,
        moderation_notes: parsed.reason,
        moderated_at: new Date(),
      })
      .where(eq(videoTestimonials.id, parseInt(req.params.id)));

    res.json({ success: true, message: 'Testimonial rejected' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error rejecting testimonial:', error);
    res.status(500).json({ error: 'Failed to reject testimonial' });
  }
});

// GET /api/video-testimonials/pending - Get pending testimonials (ADMIN)
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const pending = await db.select().from(videoTestimonials)
      .where(eq(videoTestimonials.status, 'pending'))
      .orderBy(videoTestimonials.created_at);

    res.json(pending);
  } catch (error) {
    console.error('Error fetching pending testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch pending testimonials' });
  }
});

export default router;

