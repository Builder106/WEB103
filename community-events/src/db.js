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

export async function getLocations() {
  const { rows } = await query(
    `SELECT
      location_slug,
      location_name,
      MIN(location_image) AS location_image,
      MIN(location_description) AS location_description,
      COUNT(*)::int AS event_count
     FROM events
     GROUP BY location_slug, location_name
     ORDER BY location_name ASC`
  );
  return rows;
}

export async function getLocationBySlug(slug) {
  const { rows } = await query(
    `SELECT
      location_slug,
      location_name,
      MIN(location_image) AS location_image,
      MIN(location_description) AS location_description,
      COUNT(*)::int AS event_count
     FROM events
     WHERE location_slug = $1
     GROUP BY location_slug, location_name`,
    [slug]
  );
  return rows[0] || null;
}

export async function getEventsByLocationSlug(slug) {
  const { rows } = await query(
    `SELECT id, event_slug, title, description, starts_at, venue, image, location_slug, location_name
     FROM events
     WHERE location_slug = $1
     ORDER BY starts_at ASC`,
    [slug]
  );
  return rows;
}

export async function getAllEvents() {
  const { rows } = await query(
    `SELECT id, event_slug, title, description, starts_at, venue, image, location_slug, location_name
     FROM events
     ORDER BY starts_at ASC`
  );
  return rows;
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function getEventBySlug(slug) {
   const { rows } = await query(
     `SELECT id, event_slug, title, description, starts_at, venue, image, location_slug, location_name
      FROM events
      WHERE event_slug = $1
      LIMIT 1`,
     [slug]
   );
   return rows[0] || null;
}
