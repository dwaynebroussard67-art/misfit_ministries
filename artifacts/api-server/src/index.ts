import { createApp } from './app.js';
import apiRoutes from './routes/index.js';

const app = createApp();

// Mount API routes at /api
app.use('/api', apiRoutes);

// 404 handler (must come after all routes)
app.use((req: any, res: any) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware (must be last)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '10000', 10);
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Misfit Ministries API Server running on ${HOST}:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/healthz`);
  console.log(`💬 Nura AI: POST http://localhost:${PORT}/api/nura/chat`);
  console.log(`🔐 Forge Admin: POST http://localhost:${PORT}/api/forge/auth`);
});
