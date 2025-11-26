// services/directory/src/domain/entities/DirectoryEntry.ts

/**
 * A single entry in the DIR∅ directory.
 *
 * Represents either a person, a team, or a company.
 */
export interface DirectoryEntry {
  /** Unique identifier of the entry. */
  id: string;

  /** Human-friendly display name. */
  name: string;

  /** Contact email. */
  email: string;

  /** Tags used for search and categorization. */
  tags: string[];
}
