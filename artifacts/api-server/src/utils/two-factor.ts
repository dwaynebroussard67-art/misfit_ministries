import crypto from 'crypto';
import { getDb, twoFactorChallenges } from '@workspace/db';
import { eq } from 'drizzle-orm';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

export async function createOTPChallenge(
  userId: string,
  method: 'sms' | 'email'
): Promise<string> {
  const code = generateOTP();
  const db = await getDb();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.insert(twoFactorChallenges).values({
    user_id: userId,
    code,
    method,
    expires_at: expiresAt,
  });

  return code;
}

export async function verifyOTP(userId: string, code: string): Promise<boolean> {
  const db = await getDb();

  const challenge = await db.select().from(twoFactorChallenges)
    .where(eq(twoFactorChallenges.user_id, userId))
    .orderBy(twoFactorChallenges.created_at)
    .limit(1);

  if (challenge.length === 0) {
    return false;
  }

  const otpChallenge = challenge[0];

  // Check if expired
  if (new Date() > otpChallenge.expires_at) {
    return false;
  }

  // Check if max attempts exceeded
  if ((otpChallenge.attempts || 0) >= (otpChallenge.max_attempts || 3)) {
    return false;
  }

  // Check if code matches
  if (otpChallenge.code !== code) {
    // Increment attempts
    await db.update(twoFactorChallenges)
      .set({ attempts: (otpChallenge.attempts || 0) + 1 })
      .where(eq(twoFactorChallenges.id, otpChallenge.id));
    return false;
  }

  // Valid OTP - delete challenge
  await db.delete(twoFactorChallenges)
    .where(eq(twoFactorChallenges.id, otpChallenge.id));

  return true;
}

export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  const db = await getDb();
  // Implement backup code verification logic
  return false;
}

export async function sendOTPViaSMS(phoneNumber: string, code: string): Promise<void> {
  // Implement SMS sending with Twilio or similar
  console.log(`[SMS] Sending OTP ${code} to ${phoneNumber}`);
}

export async function sendOTPViaEmail(email: string, code: string): Promise<void> {
  // Implement email sending
  console.log(`[EMAIL] Sending OTP ${code} to ${email}`);
}
