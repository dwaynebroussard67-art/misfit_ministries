/**
 * Root entry point for Render deployment
 * This wraps the built API server from artifacts/api-server/dist/index.js
 */

import('./artifacts/api-server/dist/index.js').catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
