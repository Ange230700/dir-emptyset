// services/directory/src/http/validation/directorySchemas.ts
import { z } from 'zod';

/**
 * Schema for POST /entries request body
 */
export const createDirectoryEntryBodySchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.email({ message: 'email must be a valid email' }),
  tags: z
    .array(z.string().min(1, 'tag must be a non-empty string'))
    .min(1, 'tags must contain at least one item'),
});

export type CreateDirectoryEntryBody = z.infer<typeof createDirectoryEntryBodySchema>;

/**
 * Schema for GET /entries/search query params
 */
export const searchDirectoryEntriesQuerySchema = z.object({
  q: z.string().min(1, 'q must be a non-empty string'),
});

export type SearchDirectoryEntriesQuery = z.infer<typeof searchDirectoryEntriesQuerySchema>;
