import { Router, Request, Response } from 'express';
import { getDb, twoFactorAuth } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
  generateOTP,
  generateBackupCodes,
  createOTPChallenge,
  verifyOTP,
  sendOTPViaSMS,
  sendOTPViaEmail,
} from '../utils/two-factor.js';

const router = Router();

// POST /api/2fa/setup - Setup 2FA for user
router.post('/setup', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.string(),
      method: z.enum(['sms', 'email']),
      phoneNumber: z.string().optional(),
      email: z.string().email().optional(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    // Check if 2FA already exists
    const existing = await db.select().from(twoFactorAuth)
      .where(eq(twoFactorAuth.user_id, parsed.userId));

    if (existing.length > 0) {
      res.status(400).json({ error: '2FA already configured' });
      return;
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Create 2FA record
    await db.insert(twoFactorAuth).values({
      user_id: parsed.userId,
      method: parsed.method,
      phone_number: parsed.phoneNumber,
      email: parsed.email,
      backup_codes: JSON.stringify(backupCodes),
      is_enabled: false, // Requires verification
    });

    // Send initial OTP
    const otp = await createOTPChallenge(parsed.userId, parsed.method);

    if (parsed.method === 'sms' && parsed.phoneNumber) {
      await sendOTPViaSMS(parsed.phoneNumber, otp);
    } else if (parsed.method === 'email' && parsed.email) {
      await sendOTPViaEmail(parsed.email, otp);
    }

    res.json({
      success: true,
      message: `Verification code sent via ${parsed.method}`,
      backupCodes, // Return for user to save
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// POST /api/2fa/verify - Verify 2FA setup with OTP
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.string(),
      code: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    // Verify OTP
    const isValid = await verifyOTP(parsed.userId, parsed.code);

    if (!isValid) {
      res.status(400).json({ error: 'Invalid verification code' });
      return;
    }

    // Enable 2FA
    await db.update(twoFactorAuth).set({ is_enabled: true })
      .where(eq(twoFactorAuth.user_id, parsed.userId));

    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// POST /api/2fa/request-code - Request new OTP
router.post('/request-code', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    // Get user's 2FA settings
    const twoFa = await db.select().from(twoFactorAuth)
      .where(eq(twoFactorAuth.user_id, parsed.userId));

    if (twoFa.length === 0) {
      res.status(400).json({ error: '2FA not configured' });
      return;
    }

    const config = twoFa[0];
    const otp = await createOTPChallenge(parsed.userId, config.method as 'sms' | 'email');

    if (config.method === 'sms' && config.phone_number) {
      await sendOTPViaSMS(config.phone_number, otp);
    } else if (config.method === 'email' && config.email) {
      await sendOTPViaEmail(config.email, otp);
    }

    res.json({ success: true, message: `Code sent via ${config.method}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error requesting code:', error);
    res.status(500).json({ error: 'Failed to request code' });
  }
});

// POST /api/2fa/disable - Disable 2FA
router.post('/disable', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.string(),
    });

    const parsed = schema.parse(req.body);
    const db = await getDb();

    await db.delete(twoFactorAuth)
      .where(eq(twoFactorAuth.user_id, parsed.userId));

    res.json({ success: true, message: '2FA disabled' });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

export default router;
