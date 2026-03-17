import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

export const isDbEnabled = Boolean(process.env.DATABASE_URL);

const SEED_ITEMS = [
  { id: 1, slug: 'event-1', title: 'Event 1', text: 'Description 1', category: 'music', price: '$10', image: 'https://picsum.photos/seed/event1/600/400' },
  { id: 2, slug: 'event-2', title: 'Event 2', text: 'Description 2', category: 'festival', price: '$15', image: 'https://picsum.photos/seed/event2/600/400' },
  { id: 3, slug: 'event-3', title: 'Event 3', text: 'Description 3', category: 'open-mic', price: '$20', image: 'https://picsum.photos/seed/event3/600/400' },
  { id: 4, slug: 'event-4', title: 'Event 4', text: 'Description 4', category: 'workshop', price: '$25', image: 'https://picsum.photos/seed/event4/600/400' },
  { id: 5, slug: 'event-5', title: 'Event 5', text: 'Description 5', category: 'student-showcase', price: '$30', image: 'https://picsum.photos/seed/event5/600/400' },
];

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
  function fromSeed() {
    let items = SEED_ITEMS;
    if (category) items = items.filter((i) => i.category.toLowerCase() === String(category).toLowerCase());
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(needle) || i.category.toLowerCase().includes(needle));
    }
    return items;
  }
  if (!isDbEnabled) {
    return fromSeed();
  }
  try {
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
  } catch {
    return fromSeed();
  }
}

export async function getItemBySlug(slug) {
  if (!isDbEnabled) {
    return SEED_ITEMS.find((i) => i.slug === slug) || null;
  }
  try {
    const { rows } = await query('SELECT * FROM items WHERE slug=$1 LIMIT 1', [slug]);
    return rows[0] || null;
  } catch {
    return SEED_ITEMS.find((i) => i.slug === slug) || null;
  }
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}


