// services/directory/src/infrastructure/repositories/PrismaDirectoryRepository.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  prisma,
  PrismaDirectoryRepository,
} from '@services/directory/src/infrastructure/repositories/PrismaDirectoryRepository.js';

describe('PrismaDirectoryRepository', () => {
  const repo = new PrismaDirectoryRepository();

  beforeAll(async () => {
    // Ensure DB is reachable and migrations are applied.
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Clean table before each test to avoid cross-test pollution.
    await prisma.directoryEntry.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a directory entry with a generated id', async () => {
    const created = await repo.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      tags: ['backend', 'typescript'],
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Jane Doe');
    expect(created.email).toBe('jane@example.com');
    expect(created.tags).toEqual(['backend', 'typescript']);
  });

  it('searches entries by name and tags', async () => {
    await repo.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      tags: ['backend', 'typescript'],
    });

    await repo.create({
      name: 'John Smith',
      email: 'john@example.com',
      tags: ['frontend', 'react'],
    });

    const byName = await repo.search('Jane');
    expect(byName).toHaveLength(1);
    expect(byName[0].name).toBe('Jane Doe');

    const byTag = await repo.search('react');
    expect(byTag).toHaveLength(1);
    expect(byTag[0].name).toBe('John Smith');
  });
});
