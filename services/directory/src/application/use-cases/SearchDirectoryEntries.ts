// services/directory/src/application/use-cases/SearchDirectoryEntries.ts

import type { DirectoryRepository } from '@services/directory/src/domain/repositories/DirectoryRepository.js';
import type { DirectoryEntry } from '@services/directory/src/domain/entities/DirectoryEntry.js';

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
