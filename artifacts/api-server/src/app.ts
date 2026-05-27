import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pinoHttp from 'pino-http';
import path from 'path';
import { fileURLToPath } from 'url';
import { prayerLimiter, nuraLimiter, forgeAuthLimiter } from './middleware/rate-limiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Serve static files from frontend dist
  const frontendPath = path.join(__dirname, '../../misfit/dist');
  app.use(express.static(frontendPath));

  // SPA fallback: serve index.html for all non-API routes
  app.use((req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  });

  return app;
}
