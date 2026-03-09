import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getAllItems, getItemBySlug } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

function renderBase(innerHtml) {
  const base = fs.readFileSync(path.join(__dirname, '..', 'public', 'base.html'), 'utf8');
  return base.replace('<div id="app"></div>', innerHtml);
}

app.get('/', async (req, res) => {
  const { category, q } = req.query;
  const items = await getAllItems({ category, q });
  const searchForm = `
    <form class="search-form" action="/" method="get" role="search">
      <input type="text" name="q" value="${escapeAttr(q || '')}" placeholder="Search by title or category" aria-label="Search" />
      <select name="category" aria-label="Filter by category">
        <option value="">All categories</option>
        <option value="music"${category === 'music' ? ' selected' : ''}>music</option>
        <option value="festival"${category === 'festival' ? ' selected' : ''}>festival</option>
        <option value="open-mic"${category === 'open-mic' ? ' selected' : ''}>open-mic</option>
        <option value="workshop"${category === 'workshop' ? ' selected' : ''}>workshop</option>
        <option value="student-showcase"${category === 'student-showcase' ? ' selected' : ''}>student-showcase</option>
      </select>
      <button type="submit">Search</button>
    </form>`;
  const itemsHtml = items.map(item =>
    `<article class="card" data-testid="list-item">
      <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" />
      <h2><a href="/items/${item.slug}">${escapeAttr(item.title)}</a></h2>
      <p>${escapeAttr(item.text)}</p>
      <p class="muted">Category: ${escapeAttr(item.category)} · Price: ${escapeAttr(item.price)}</p>
    </article>`
  ).join('');
  const emptyMsg = items.length === 0 ? '<p class="muted">No items match your search.</p>' : '';
  res.send(renderBase(`${searchForm}<section class="grid">${itemsHtml}</section>${emptyMsg}`));
});

app.get('/items/:slug', async (req, res, next) => {
  const item = await getItemBySlug(req.params.slug);
  if (!item) return next();
  const pairs = Object.entries(item)
    .map(([k, v]) => `<p><strong>${escapeAttr(k)}:</strong> ${escapeAttr(v)}</p>`)
    .join('');
  const html = `
    <a class="back-link" href="/">← Back to list</a>
    <article class="detail">
      <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" />
      <header>
        <h2>${escapeAttr(item.title)}</h2>
        <p class="muted">Category: ${escapeAttr(item.category)} · Price: ${escapeAttr(item.price)}</p>
      </header>
      <p>${escapeAttr(item.text)}</p>
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


