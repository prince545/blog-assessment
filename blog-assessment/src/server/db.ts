import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const client = neon(connectionString);
  return drizzle(client, { schema });
}
// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';
// import * as schema from '@/db/schema';

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, { schema });