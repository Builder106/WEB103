import request from 'supertest';
import { app } from '../src/server.js';
import { closeDb } from '../src/db.js';

const hasDb = Boolean(process.env.DATABASE_URL) && process.env.RUN_DB_TESTS === '1';

(hasDb ? describe : describe.skip)('Week 3 DB-backed API', () => {
  test('GET /api/locations returns available locations', async () => {
    const res = await request(app).get('/api/locations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
    expect(res.body[0]).toEqual(
      expect.objectContaining({
        location_slug: expect.any(String),
        location_name: expect.any(String),
      })
    );
  });

  test('GET /api/locations/:slug/events returns events for one location', async () => {
    const locationsRes = await request(app).get('/api/locations');
    const slug = locationsRes.body[0].location_slug;
    const res = await request(app).get(`/api/locations/${slug}/events`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        location: expect.any(Object),
        events: expect.any(Array),
      })
    );
    expect(res.body.events.length).toBeGreaterThanOrEqual(1);
    expect(res.body.events[0].location_slug).toBe(slug);
  });

  test('GET /api/events returns all events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });

  afterAll(async () => {
    await closeDb();
  });
});


