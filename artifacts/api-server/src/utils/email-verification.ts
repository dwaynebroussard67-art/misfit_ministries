import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getDb, emailVerifications } from '@workspace/db';
import { eq } from 'drizzle-orm';

/**
 * Generate a verification token
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create email verification record
 */
export async function createEmailVerification(email: string, userId: string) {
  const db = await getDb();
  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(emailVerifications).values({
    id: uuidv4(),
    email,
    userId,
    token,
    expiresAt,
    verified: false,
  });

  return token;
}

/**
 * Verify email token
 */
export async function verifyEmailToken(token: string) {
  const db = await getDb();

  const verification = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token));

  if (!verification.length) {
    return { success: false, error: 'Invalid token' };
  }

  const record = verification[0];

  // Check if token is expired
  if (new Date(record.expiresAt) < new Date()) {
    return { success: false, error: 'Token expired' };
  }

  // Mark as verified
  await db
    .update(emailVerifications)
    .set({ verified: true })
    .where(eq(emailVerifications.token, token));

  return { success: true, email: record.email, userId: record.userId };
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  const db = await getDb();

  const verification = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.email, email));

  if (!verification.length) {
    return false;
  }

  return verification[0].verified;
}
