const request = require('supertest');
const app = require('../src/app');

describe('Event API', () => {
    it('should create an event', async () => {
        const res = await request(app).post('/api/events').send({
            name: 'Meeting',
            description: 'Team meeting',
            category: 'Work',
            date: '2025-04-01T10:00:00Z'
        });
        expect(res.statusCode).toBe(201);
    });
});
