import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

export const isDbEnabled = Boolean(process.env.DATABASE_URL);

let pool = null;
if (isDbEnabled) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : undefined,
  });
}

export async function query(text, params) {
  if (!isDbEnabled) throw new Error('DATABASE_URL is required. No fallback is available.');
  return pool.query(text, params);
}

export async function getAllItems(filters = {}) {
  const { category, q } = filters;
  if (category) {
    const { rows } = await query(
      'SELECT * FROM items WHERE category ILIKE $1 ORDER BY id ASC',
      [category]
    );
    return rows;
  }
  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`;
    const { rows } = await query(
      'SELECT * FROM items WHERE title ILIKE $1 OR category ILIKE $1 ORDER BY id ASC',
      [pattern]
    );
    return rows;
  }
  const { rows } = await query('SELECT * FROM items ORDER BY id ASC');
  return rows;
}

export async function getItemBySlug(slug) {
  const { rows } = await query('SELECT * FROM items WHERE slug=$1 LIMIT 1', [slug]);
  return rows[0] || null;
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}


