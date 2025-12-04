// services/directory/src/domain/repositories/DirectoryRepository.ts
import type { DirectoryEntry } from '@services/directory/src/domain/entities/DirectoryEntry.js';

/**
 * Persistence boundary for directory entries.
 *
 * Infrastructure (Prisma, HTTP, etc.) will implement this.
 */
export interface DirectoryRepository {
  /**
   * Create a new directory entry.
   *
   * @param entry - Entry data without an ID.
   */
  create(entry: Omit<DirectoryEntry, 'id'>): Promise<DirectoryEntry>;

  /**
   * Search entries matching a free-text query.
   *
   * Implementations decide how to match (name, email, tags, etc.).
   *
   * @param query - Text to search.
   */
  search(query: string): Promise<DirectoryEntry[]>;
}
