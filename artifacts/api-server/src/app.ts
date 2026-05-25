import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { prayerLimiter, nuraLimiter, forgeAuthLimiter } from './middleware/rate-limiter.js';

export function createApp(): Express {
  const app = express();

  // Logging middleware
  app.use(pinoHttp({
    quietReqLogger: true,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }));

  // CORS middleware (must come early for credentials)
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.PRODUCTION_URL || 'https://misfit-ministries.manus.space',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // Cookie parser (before JSON parser)
  app.use(cookieParser());

  // JSON body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Health check endpoint
  app.get('/api/healthz', (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Rate limiters
  app.use('/api/prayers', prayerLimiter);
  app.use('/api/nura/chat', nuraLimiter);
  app.use('/api/forge/auth', forgeAuthLimiter);

  return app;
}
