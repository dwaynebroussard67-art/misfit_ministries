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
    'http://localhost:5173',
    'http://localhost:3000',
    'https://misfit-ministries.onrender.com',
    'https://misfit-ministries.anrender.com',
    process.env.FRONTEND_URL || '',
    process.env.PRODUCTION_URL || 'https://misfit-ministries.manus.space',
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
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
  // Use absolute path from project root to ensure it works on Render
  const frontendPath = path.join(process.cwd(), 'artifacts/misfit/dist');
  console.log(`📁 Serving frontend from: ${frontendPath}`);
  
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    etag: false,
  }));

  // SPA fallback: serve index.html for all non-API routes
  app.use((req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendPath, 'index.html');
      console.log(`📄 Serving index.html from: ${indexPath}`);
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  });

  return app;
}
