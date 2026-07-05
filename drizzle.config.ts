import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_DIRECT_URL) {
  throw new Error('DATABASE_DIRECT_URL is not set in the environment variables.');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL,
  },
  schemaFilter: ["public"],
});
