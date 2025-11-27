// services/directory/src/infrastructure/repositories/PrismaDirectoryRepository.ts
import { PrismaClient } from '../../../generated/client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

import type { DirectoryRepository } from '../../domain/repositories/DirectoryRepository.js';
import type { DirectoryEntry as DomainDirectoryEntry } from '../../domain/entities/DirectoryEntry.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fail fast with a clear error instead of cryptic SASL issues
  throw new Error(
    'DATABASE_URL is not set. Add it to services/directory/.env or your shell environment.',
  );
}

// Prisma 7 adapter-based client
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

export class PrismaDirectoryRepository implements DirectoryRepository {
  async create(entry: Omit<DomainDirectoryEntry, 'id'>): Promise<DomainDirectoryEntry> {
    const created = await prisma.directoryEntry.create({
      data: {
        name: entry.name,
        email: entry.email,
        tags: entry.tags,
      },
    });

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      tags: created.tags,
    };
  }

  async search(query: string): Promise<DomainDirectoryEntry[]> {
    const q = query.toLowerCase();

    const results = await prisma.directoryEntry.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      },
    });

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      tags: r.tags,
    }));
  }
}
