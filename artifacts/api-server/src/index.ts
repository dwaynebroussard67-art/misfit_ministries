import { createApp } from './app.js';
import apiRoutes from './routes/index.js';

const app = createApp();

// Mount API routes at /api
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Misfit Ministries API Server running on port ${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/healthz`);
  console.log(`💬 Nura AI: POST http://localhost:${PORT}/api/nura/chat`);
  console.log(`🔐 Forge Admin: POST http://localhost:${PORT}/api/forge/auth`);
});
