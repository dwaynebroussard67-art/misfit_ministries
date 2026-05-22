import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql2',
  schema: './lib/db/src/schema',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/misfit_ministries',
  },
});
