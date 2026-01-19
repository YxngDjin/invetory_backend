import app from '#src/app.js';
import request from 'supertest';

describe('API ENDPOINTS', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return Hello World Message', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.text).toBe('Hello from Inventory Backend!');
    });
  });

  describe('GET /nonexistant', () => {
    it('should return 404 for non existent routes', async () => {
      const response = await request(app).get('/nonexistant').expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
