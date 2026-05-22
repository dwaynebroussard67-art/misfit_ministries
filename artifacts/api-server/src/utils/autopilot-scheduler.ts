import { getDb, autopilotContent } from '@workspace/db';
import { eq } from 'drizzle-orm';

let autopilotRunning = false;

export async function startAutopilot() {
  if (autopilotRunning) return;
  autopilotRunning = true;

  const interval = parseInt(process.env.AUTOPILOT_CHECK_MINUTES || '5') * 60 * 1000;

  setInterval(async () => {
    try {
      await runAutopilot();
    } catch (error) {
      console.error('Autopilot error:', error);
    }
  }, interval);

  console.log('Autopilot publisher started');
}

export async function stopAutopilot() {
  autopilotRunning = false;
  console.log('Autopilot publisher stopped');
}

export async function runAutopilot() {
  try {
    const db = await getDb();

    // Get pending content
    const pending = await db.select().from(autopilotContent)
      .where(eq(autopilotContent.status, 'pending'));

    for (const item of pending) {
      // Auto-approve and mark as posted
      await db.update(autopilotContent).set({
        status: 'posted',
        posted_at: new Date(),
      }).where(eq(autopilotContent.id, item.id));

      console.log(`Autopilot: Posted ${item.type} to ${item.platform}`);
    }
  } catch (error) {
    console.error('Error running autopilot:', error);
  }
}

export async function getAutopilotStatus() {
  try {
    const db = await getDb();

    const pending = await db.select().from(autopilotContent)
      .where(eq(autopilotContent.status, 'pending'));

    const posted = await db.select().from(autopilotContent)
      .where(eq(autopilotContent.status, 'posted'));

    return {
      running: autopilotRunning,
      pending_count: pending.length,
      posted_count: posted.length,
    };
  } catch (error) {
    console.error('Error getting autopilot status:', error);
    return { running: autopilotRunning, pending_count: 0, posted_count: 0 };
  }
}
