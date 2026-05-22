import { getDb, autopilotContent } from '@workspace/db';
import { generateNuraResponse } from './nura-adapter.js';

let generatorRunning = false;

export async function startMediaGenerator() {
  if (generatorRunning) return;
  generatorRunning = true;

  const interval = parseInt(process.env.MEDIA_INTERVAL_HOURS || '24') * 60 * 60 * 1000;

  setInterval(async () => {
    try {
      await generateContent();
    } catch (error) {
      console.error('Media generator error:', error);
    }
  }, interval);

  console.log('Content Creator started');
}

export async function stopMediaGenerator() {
  generatorRunning = false;
  console.log('Content Creator stopped');
}

export async function generateContent() {
  try {
    const db = await getDb();

    // Generate 4 social posts
    const platforms = ['Twitter/X', 'Facebook', 'Instagram', 'LinkedIn'];

    for (const platform of platforms) {
      const prompt = `Generate a short, engaging social media post for ${platform} about Misfit Ministries, faith, redemption, or mental health crisis support. Keep it under 280 characters.`;

      const content = await generateNuraResponse(prompt);

      await db.insert(autopilotContent).values({
        type: 'social_post',
        platform,
        content,
        status: 'pending',
        generated_at: new Date(),
      });
    }

    // Generate 2 merch ideas
    for (let i = 0; i < 2; i++) {
      const prompt = `Generate a creative merchandise idea for Misfit Ministries. Include product type, design concept, and target audience. Keep it concise.`;

      const content = await generateNuraResponse(prompt);

      await db.insert(autopilotContent).values({
        type: 'merch_idea',
        content,
        status: 'pending',
        generated_at: new Date(),
      });
    }

    console.log('Content generation complete: 4 social posts + 2 merch ideas');
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

export async function getGeneratorStatus() {
  return {
    running: generatorRunning,
    message: generatorRunning ? 'Content Creator is active' : 'Content Creator is inactive',
  };
}
