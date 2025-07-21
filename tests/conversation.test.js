import request from 'supertest';
import app from '../src/app.js';
import { students } from '../src/data/mockData.js';

describe('Conversation API', () => {
  let studentId = students[0].id;

  it('should start a conversation', async () => {
    const res = await request(app)
      .post('/api/start-conversation')
      .send({ studentId });
    expect(res.statusCode).toBe(200);
    expect(res.body.sent).toMatch(/Felicidades/);
  });

  it('should handle first reply (job type)', async () => {
    const res = await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'full-time' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/remoto o presencial/);
  });

  it('should handle second reply (model)', async () => {
    const res = await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'remote' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/área de estudio/);
  });

  it('should handle third reply (area) and return jobs', async () => {
    await request(app)
      .post('/api/start-conversation')
      .send({ studentId });
    await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'full-time' });
    await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'remote' });
    const res = await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'desarrollo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toBeInstanceOf(Array);
    expect(res.body.jobs.length).toBeGreaterThan(0);
  });

  it('should handle "I don\'t know yet" and recommend jobs by area', async () => {
    await request(app)
      .post('/api/start-conversation')
      .send({ studentId });
    await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: "I don't know yet" });
    const res = await request(app)
      .post('/api/whatsapp-webhook')
      .send({ studentId, text: 'desarrollo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toBeInstanceOf(Array);
    expect(res.body.jobs.length).toBeGreaterThan(0);
    expect(res.body.message).toMatch(/recomiendo estos trabajos/);
  });
});
