import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  getAllEvents,
  getEventsByLocationSlug,
  getLocationBySlug,
  getLocations,
  getEventBySlug,
} from './db.js';
import { isDbEnabled, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

function renderBase(innerHtml = '') {
  const base = fs.readFileSync(path.join(__dirname, '..', 'public', 'base.html'), 'utf8');
  return base.replace('<div id="app"></div>', `<div id="app">${innerHtml}</div>`);
}

app.get('/api/locations', async (req, res) => {
  const locations = await getLocations();
  res.json(locations);
});

app.get('/api/locations/:slug/events', async (req, res) => {
  const location = await getLocationBySlug(req.params.slug);
  if (!location) {
    res.status(404).json({ error: 'Location not found' });
    return;
  }
  const events = await getEventsByLocationSlug(req.params.slug);
  res.json({ location, events });
});

app.get('/api/events', async (req, res) => {
  const events = await getAllEvents();
  res.json(events);
});

app.get('/api/events/:eventSlug', async (req, res) => {
   const event = await getEventBySlug(req.params.eventSlug);
   if (!event) {
     res.status(404).json({ error: 'Event not found' });
     return;
   }
   res.json(event);
});

app.get('/api/_debug/db', async (req, res) => {
  if (!isDbEnabled) {
    res.status(500).json({ ok: false, dbEnabled: false, error: 'DATABASE_URL is not set' });
    return;
  }
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM events');
  res.json({ ok: true, dbEnabled: true, eventsCount: rows[0]?.count ?? 0 });
});

app.get('/api/_debug/events', async (req, res) => {
  if (!isDbEnabled) {
    res.status(500).json({ ok: false, dbEnabled: false, error: 'DATABASE_URL is not set' });
    return;
  }
  const limit = Math.max(1, Math.min(25, Number(req.query.limit) || 10));
  const { rows } = await query(
    `SELECT id, event_slug, title, starts_at, venue, location_slug, location_name
     FROM events
     ORDER BY starts_at ASC
     LIMIT $1`,
    [limit]
  );
  res.json({ ok: true, limit, rows });
});

app.get('/', (req, res) => {
  res.send(renderBase());
});

app.get('/locations/:slug', (req, res) => {
  res.send(renderBase());
});

app.get('/events', (req, res) => {
  res.send(renderBase());
});

app.get('/events/:eventSlug', (req, res) => {
   res.send(renderBase());
 });

app.get('/debug', (req, res) => {
  res.send(renderBase());
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((req, res) => {
  const notFoundHtml = `
    <section>
      <h2>Page not found</h2>
      <p class="subtitle">That route doesn’t exist in this app.</p>
      <a class="chip" href="/">Go back home</a>
    </section>
    <script>window.__NOT_FOUND__=true;</script>
  `;
  res.status(404).send(renderBase(notFoundHtml));
});



if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}


