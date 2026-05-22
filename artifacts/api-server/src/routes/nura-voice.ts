import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateNuraVoice } from '../utils/elevenlabs-tts.js';

const router: ReturnType<typeof Router> = Router();

const voiceRequestSchema = z.object({
  text: z.string().min(1),
  stability: z.number().optional().default(0.5),
  similarityBoost: z.number().optional().default(0.75),
});

// POST /api/nura/voice - Generate voice audio for Nura response
router.post('/voice', async (req: Request, res: Response) => {
  try {
    const parsed = voiceRequestSchema.parse(req.body);

    const audio = await generateNuraVoice({
      text: parsed.text,
      stability: parsed.stability,
      similarityBoost: parsed.similarityBoost,
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audio.length);
    res.send(audio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error generating voice:', error);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
});

export default router;
