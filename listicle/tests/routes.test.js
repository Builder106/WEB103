import request from 'supertest';
import { app, dataset } from '../src/server.js';

describe('Listicle routes', () => {
  test('GET / should render title and at least 5 items', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/<h1[^>]*>.*Listicle.*<\/h1>/i);
    const count = (res.text.match(/data-testid="list-item"/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('each item has at least 3 attributes on list view', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    const keys = Object.keys(dataset[0]);
    expect(keys.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /items/:slug shows detail view with all fields', async () => {
    const item = dataset[0];
    const res = await request(app).get(`/items/${item.slug}`);
    expect(res.status).toBe(200);
    for (const key of Object.keys(item)) {
      expect(res.text).toContain(String(item[key]));
    }
  });

  test('GET unknown route returns custom 404', async () => {
    const res = await request(app).get('/not-a-real-route');
    expect(res.status).toBe(404);
    expect(res.text.toLowerCase()).toContain('page not found');
  });
});
