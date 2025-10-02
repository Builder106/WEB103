import request from 'supertest';
import { app } from '../src/server.js';
import { closeDb } from '../src/db.js';

const hasDb = Boolean(process.env.DATABASE_URL);

(hasDb ? describe : describe.skip)('DB-backed routes', () => {
  test('GET / returns items from DB', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    // Should render at least the seeded 5 items
    const count = (res.text.match(/data-testid="list-item"/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('GET /items/event-1 returns event detail', async () => {
    const res = await request(app).get('/items/event-1');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Event 1');
    expect(res.text).toContain('Description 1');
  });

  afterAll(async () => {
    await closeDb();
  });
});


