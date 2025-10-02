import 'dotenv/config';
import pkg from 'pg';

const { Client } = pkg;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set. Skipping DB setup.');
    process.exit(0);
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT NOT NULL
      );
    `);
    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM items');
    if (rows[0].count === 0) {
      await client.query(
        `INSERT INTO items (slug, title, text, category, price, image) VALUES
          ('event-1','Event 1','Description 1','music','$10','https://picsum.photos/seed/event1/600/400'),
          ('event-2','Event 2','Description 2','music','$15','https://picsum.photos/seed/event2/600/400'),
          ('event-3','Event 3','Description 3','music','$20','https://picsum.photos/seed/event3/600/400'),
          ('event-4','Event 4','Description 4','music','$25','https://picsum.photos/seed/event4/600/400'),
          ('event-5','Event 5','Description 5','music','$30','https://picsum.photos/seed/event5/600/400')`
      );
      console.log('Seeded items table.');
    } else {
      console.log('Items table already has data.');
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


