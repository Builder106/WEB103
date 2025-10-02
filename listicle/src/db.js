import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

export const isDbEnabled = Boolean(process.env.DATABASE_URL);

let pool = null;
if (isDbEnabled) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function query(text, params) {
  if (!isDbEnabled) throw new Error('DB not enabled');
  return pool.query(text, params);
}

export async function getAllItems() {
  if (!isDbEnabled) return [];
  const { rows } = await query('SELECT * FROM items ORDER BY id ASC');
  return rows;
}

export async function getItemBySlug(slug) {
  if (!isDbEnabled) return null;
  const { rows } = await query('SELECT * FROM items WHERE slug=$1 LIMIT 1', [slug]);
  return rows[0] || null;
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}


