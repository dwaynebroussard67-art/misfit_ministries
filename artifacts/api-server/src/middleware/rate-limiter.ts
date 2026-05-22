import rateLimit from 'express-rate-limit';

export const prayerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many prayer submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const nuraLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 45, // 45 requests per hour
  message: 'Too many Nura requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgeAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
