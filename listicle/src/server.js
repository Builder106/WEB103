import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getAllItems, getItemBySlug } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// No dataset fallback; DB required

export const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

function renderBase(innerHtml) {
  const base = fs.readFileSync(path.join(__dirname, '..', 'public', 'base.html'), 'utf8');
  return base.replace('<div id="app"></div>', innerHtml);
}

app.get('/', async (req, res) => {
  const items = await getAllItems();
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
  const item = await getItemBySlug(req.params.slug);
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


