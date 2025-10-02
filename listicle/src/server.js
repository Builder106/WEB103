import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { isDbEnabled, getAllItems, getItemBySlug } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataset = [
  { slug: 'event-1', title: 'Event 1', text: 'Description 1', category: 'music', price: '$10', image: 'https://picsum.photos/seed/event1/600/400' },
  { slug: 'event-2', title: 'Event 2', text: 'Description 2', category: 'music', price: '$15', image: 'https://picsum.photos/seed/event2/600/400' },
  { slug: 'event-3', title: 'Event 3', text: 'Description 3', category: 'music', price: '$20', image: 'https://picsum.photos/seed/event3/600/400' },
  { slug: 'event-4', title: 'Event 4', text: 'Description 4', category: 'music', price: '$25', image: 'https://picsum.photos/seed/event4/600/400' },
  { slug: 'event-5', title: 'Event 5', text: 'Description 5', category: 'music', price: '$30', image: 'https://picsum.photos/seed/event5/600/400' }
];

export const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

function renderBase(innerHtml) {
  const base = fs.readFileSync(path.join(__dirname, '..', 'public', 'base.html'), 'utf8');
  return base.replace('<div id="app"></div>', innerHtml);
}

app.get('/', async (req, res) => {
  const items = isDbEnabled ? await getAllItems() : dataset;
  const itemsHtml = items.map(item =>
    `<article class="card" data-testid="list-item">
      <img src="${item.image}" alt="${item.title}" />
      <h2><a href="/items/${item.slug}">${item.title}</a></h2>
      <p>${item.text}</p>
      <p class="muted">Category: ${item.category} · Price: ${item.price}</p>
    </article>`
  ).join('');
  res.send(renderBase(`<section class="grid">${itemsHtml}</section>`));
});

app.get('/items/:slug', async (req, res, next) => {
  const item = isDbEnabled ? await getItemBySlug(req.params.slug) : dataset.find(i => i.slug === req.params.slug);
  if (!item) return next();
  const pairs = Object.entries(item)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`) 
    .join('');
  const html = `
    <a class="back-link" href="/">← Back to list</a>
    <article class="detail">
      <img src="${item.image}" alt="${item.title}" />
      <header>
        <h2>${item.title}</h2>
        <p class="muted">Category: ${item.category} · Price: ${item.price}</p>
      </header>
      <p>${item.text}</p>
      ${pairs}
    </article>
  `;
  res.send(renderBase(html));
});

app.use((req, res) => {
  res.status(404).send(renderBase('<h2>Page not found</h2>'));
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}


