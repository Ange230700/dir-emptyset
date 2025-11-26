// services/directory/src/application/use-cases/CreateDirectoryEntry.ts
import type { DirectoryRepository } from '../../domain/repositories/DirectoryRepository.js';
import type { DirectoryEntry } from '../../domain/entities/DirectoryEntry.js';

export interface CreateDirectoryEntryInput {
  name: string;
  email: string;
  tags?: string[];
}

/**
 * Use case responsible for creating a new directory entry.
 */
export class CreateDirectoryEntry {
  constructor(private readonly repo: DirectoryRepository) {}

  /**
   * Execute the use case.
   *
   * @throws Error if the name is empty.
   */
  async execute(input: CreateDirectoryEntryInput): Promise<DirectoryEntry> {
    const name = input.name.trim();

    if (!name) {
      throw new Error('Name is required');
    }

    // Business rules could go here (e.g., uniqueness, validation)
    return this.repo.create({
      name,
      email: input.email,
      tags: input.tags ?? [],
    });
  }
}
