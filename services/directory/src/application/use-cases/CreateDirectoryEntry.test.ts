// services/directory/src/application/use-cases/CreateDirectoryEntry.test.ts
import { describe, it, expect } from 'vitest';
import type { DirectoryRepository } from '@services/directory/src/domain/repositories/DirectoryRepository.js';
import type { DirectoryEntry } from '@services/directory/src/domain/entities/DirectoryEntry.js';
import { CreateDirectoryEntry } from '@services/directory/src/application/use-cases/CreateDirectoryEntry.js';

class InMemoryDirectoryRepository implements DirectoryRepository {
  private readonly entries: DirectoryEntry[] = [];

  async create(entry: Omit<DirectoryEntry, 'id'>): Promise<DirectoryEntry> {
    const created: DirectoryEntry = {
      id: `entry_${this.entries.length + 1}`,
      ...entry,
    };
    this.entries.push(created);
    return created;
  }

  async search(query: string): Promise<DirectoryEntry[]> {
    const q = query.toLowerCase();
    return this.entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.email.toLowerCase().includes(q) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
}

describe('CreateDirectoryEntry', () => {
  it('creates a new entry with an id', async () => {
    const repo = new InMemoryDirectoryRepository();
    const useCase = new CreateDirectoryEntry(repo);

    const result = await useCase.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      tags: ['backend', 'typescript'],
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Jane Doe');
    expect(result.email).toBe('jane@example.com');
    expect(result.tags).toEqual(['backend', 'typescript']);
  });

  it('throws when name is empty', async () => {
    const repo = new InMemoryDirectoryRepository();
    const useCase = new CreateDirectoryEntry(repo);

    await expect(
      useCase.execute({
        name: '   ',
        email: 'test@example.com',
      }),
    ).rejects.toThrow('Name is required');
  });
});
