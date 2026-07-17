import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

// Disable prefetch/prepare as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(connectionString, { prepare: false });



export const db = drizzle(client, { schema });
