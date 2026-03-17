import request from 'supertest';
import { app } from '../src/server.js';
import { closeDb } from '../src/db.js';

describe('Week 3 app shell routes', () => {
  test('GET / serves the React app shell', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<h1 class="title">World Events Explorer</h1>');
    expect(res.text).toContain('<div id="app"></div>');
  });

  test('GET /locations/:slug serves location detail shell URL', async () => {
    const res = await request(app).get('/locations/manhattan');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="app"></div>');
  });

  test('GET /debug serves DB preview shell URL', async () => {
    const res = await request(app).get('/debug');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="app"></div>');
  });

  test('GET unknown route returns 404 page', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.text).toContain('<h2>Page not found</h2>');
    expect(res.text).toContain('<div id="app">');
  });

  afterAll(async () => {
    await closeDb();
  });
});
