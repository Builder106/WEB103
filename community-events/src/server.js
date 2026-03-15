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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

function renderBase() {
  return fs.readFileSync(path.join(__dirname, '..', 'public', 'base.html'), 'utf8');
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

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});



if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}


