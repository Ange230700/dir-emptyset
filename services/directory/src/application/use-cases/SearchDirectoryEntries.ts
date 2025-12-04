// services/directory/src/application/use-cases/SearchDirectoryEntries.ts

// @ts-expect-error -- alias not resolved by TS but works via tooling
import type { DirectoryRepository } from '@services/directory/domain/repositories/DirectoryRepository';

// @ts-expect-error -- alias not resolved by TS but works via tooling
import type { DirectoryEntry } from '@services/directory/domain/entities/DirectoryEntry';

export interface SearchDirectoryEntriesInput {
  query: string;
}

/**
 * Use case responsible for searching directory entries.
 */
export class SearchDirectoryEntries {
  constructor(private readonly repo: DirectoryRepository) {}

  async execute(input: SearchDirectoryEntriesInput): Promise<DirectoryEntry[]> {
    const trimmed = input.query.trim();
    if (!trimmed) {
      // For now, empty query returns empty list – or you could decide to return all entries.
      return [];
    }

    return this.repo.search(trimmed);
  }
}
