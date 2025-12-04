// services\directory\src\http\DirectoryHttp.test.ts

import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';

import { app } from '@services/directory/src/http/app.js';
import { prisma } from '@services/directory/src/infrastructure/repositories/PrismaDirectoryRepository.js';

describe('Directory HTTP API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Clean DB between tests
    await prisma.directoryEntry.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /entries creates a directory entry', async () => {
    const response = await request(app)
      .post('/entries')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        tags: ['backend', 'typescript'],
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: 'Jane Doe',
      email: 'jane@example.com',
      tags: ['backend', 'typescript'],
    });

    // DB really has it
    const rows = await prisma.directoryEntry.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe('jane@example.com');
  });

  it('GET /entries/search returns matching entries', async () => {
    // Seed data through the API
    await request(app)
      .post('/entries')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        tags: ['backend', 'typescript'],
      });

    await request(app)
      .post('/entries')
      .send({
        name: 'John Smith',
        email: 'john@example.com',
        tags: ['frontend', 'react'],
      });

    const byName = await request(app).get('/entries/search').query({ q: 'Jane' }).expect(200);

    expect(byName.body).toHaveLength(1);
    expect(byName.body[0].name).toBe('Jane Doe');

    const byTag = await request(app).get('/entries/search').query({ q: 'react' }).expect(200);

    expect(byTag.body).toHaveLength(1);
    expect(byTag.body[0].name).toBe('John Smith');
  });

  it('rejects invalid body for POST /entries', async () => {
    const res = await request(app)
      .post('/entries')
      .send({ name: '', email: 'not-an-email', tags: [] }) // all invalid
      .expect(400);

    expect(res.body.message).toBe('Validation error');
    expect(res.body.issues).toBeDefined();
  });

  it('rejects missing q on GET /entries/search', async () => {
    const res = await request(app).get('/entries/search').expect(400);

    expect(res.body.message).toBe('Validation error');
  });
});
