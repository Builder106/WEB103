import 'dotenv/config';
import pkg from 'pg';

const { Client } = pkg;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set. Skipping DB setup.');
    process.exit(0);
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_slug TEXT UNIQUE NOT NULL,
        location_slug TEXT NOT NULL,
        location_name TEXT NOT NULL,
        location_description TEXT NOT NULL,
        location_image TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        starts_at TIMESTAMPTZ NOT NULL,
        venue TEXT NOT NULL,
        image TEXT NOT NULL
      );
    `);
    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM events');
    if (rows[0].count === 0) {
      await client.query(
        `INSERT INTO events (
          event_slug, location_slug, location_name, location_description, location_image,
          title, description, starts_at, venue, image
        ) VALUES
          (
            'brooklyn-night-market',
            'brooklyn',
            'Brooklyn',
            'Neighborhood pop-ups, indie showcases, and late-night food crawls.',
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
            'Brooklyn Night Market',
            'A curated lineup of DJs, local fashion stalls, and chef pop-ups.',
            '2026-05-18T20:00:00Z',
            'Atlantic Terminal Plaza',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80'
          ),
          (
            'manhattan-jazz-after-dark',
            'manhattan',
            'Manhattan',
            'Classic venues and skyline events with late evening energy.',
            'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=80',
            'Jazz After Dark',
            'Live sets from three modern jazz collectives in one night.',
            '2026-05-21T23:00:00Z',
            'Harlem Stage',
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80'
          ),
          (
            'queens-film-rooftop',
            'queens',
            'Queens',
            'Global food, art-forward spaces, and community-first festivals.',
            'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80',
            'Queens Rooftop Film Night',
            'An open-air screening series with live score intros before each film.',
            '2026-05-24T01:30:00Z',
            'Astoria Rooftop Commons',
            'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80'
          ),
          (
            'brooklyn-maker-fair',
            'brooklyn',
            'Brooklyn',
            'Neighborhood pop-ups, indie showcases, and late-night food crawls.',
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
            'Brooklyn Maker Fair',
            'A daytime build-and-demo event for student founders and local makers.',
            '2026-05-27T16:00:00Z',
            'Navy Yard Hall B',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80'
          ),
          (
            'manhattan-founders-mixer',
            'manhattan',
            'Manhattan',
            'Classic venues and skyline events with late evening energy.',
            'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=80',
            'Founders Mixer',
            'Networking and lightning talks for student builders and early teams.',
            '2026-05-30T22:00:00Z',
            'SoHo Loft 19',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80'
          )`
      );
      console.log('Seeded events table.');
    } else {
      console.log('Events table already has data.');
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


