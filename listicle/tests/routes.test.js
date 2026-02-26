import request from 'supertest';
import { app } from '../src/server.js';
import { closeDb } from '../src/db.js';

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
    // spot-check fields rendered per card
    expect(res.text).toMatch(/<h2><a href="\/items\/.+">.+<\/a><\/h2>/);
    expect(res.text).toMatch(/<p>[^<]+<\/p>/);
    expect(res.text).toMatch(/Category:\s.*·\sPrice:/);
  });

  test('GET /items/:slug shows detail view with all fields', async () => {
    // Use a known seeded slug
    const res = await request(app).get('/items/event-1');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Event 1');
    expect(res.text).toContain('Description 1');
    expect(res.text).toMatch(/Category:.*music/);
    expect(res.text).toMatch(/Price:.*\$10/);
  });

  test('GET unknown route returns custom 404', async () => {
    const res = await request(app).get('/not-a-real-route');
    expect(res.status).toBe(404);
    expect(res.text.toLowerCase()).toContain('page not found');
  });

  afterAll(async () => {
    await closeDb();
  });
});
