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
  app.use(cors({
    origin: true,
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

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
