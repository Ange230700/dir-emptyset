// services/directory/src/application/use-cases/SearchDirectoryEntries.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import type { DirectoryRepository } from '../../domain/repositories/DirectoryRepository.js';
import type { DirectoryEntry } from '../../domain/entities/DirectoryEntry.js';
import { CreateDirectoryEntry } from './CreateDirectoryEntry.js';
import { SearchDirectoryEntries } from './SearchDirectoryEntries.js';

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

describe('SearchDirectoryEntries', () => {
  let repo: InMemoryDirectoryRepository;
  let createEntry: CreateDirectoryEntry;
  let searchEntries: SearchDirectoryEntries;

  beforeEach(async () => {
    repo = new InMemoryDirectoryRepository();
    createEntry = new CreateDirectoryEntry(repo);
    searchEntries = new SearchDirectoryEntries(repo);

    await createEntry.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      tags: ['backend', 'typescript'],
    });

    await createEntry.execute({
      name: 'John Smith',
      email: 'john@example.com',
      tags: ['frontend', 'react'],
    });
  });

  it('finds entries by name', async () => {
    const results = await searchEntries.execute({ query: 'Jane' });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Jane Doe');
  });

  it('finds entries by tag', async () => {
    const results = await searchEntries.execute({ query: 'react' });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('John Smith');
  });

  it('returns empty array when no entries match', async () => {
    const results = await searchEntries.execute({ query: 'python' });
    expect(results).toHaveLength(0);
  });
});
