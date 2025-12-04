// services/directory/src/http/app.ts

import express, { type Request, type Response, type NextFunction } from 'express';

import { PrismaDirectoryRepository } from '@services/directory/src/infrastructure/repositories/PrismaDirectoryRepository.js';
import { CreateDirectoryEntry } from '@services/directory/src/application/use-cases/CreateDirectoryEntry.js';
import { SearchDirectoryEntries } from '@services/directory/src/application/use-cases/SearchDirectoryEntries.js';
import {
  createDirectoryEntryBodySchema,
  searchDirectoryEntriesQuerySchema,
} from '@services/directory/src/http/validation/directorySchemas.js';

const repo = new PrismaDirectoryRepository();
const createDirectoryEntry = new CreateDirectoryEntry(repo);
const searchDirectoryEntries = new SearchDirectoryEntries(repo);

export function createApp() {
  const app = express();

  app.use(express.json());

  // Optional health route for the HTTP layer
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'directory-http' });
  });

  app.post('/entries', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = createDirectoryEntryBodySchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          message: 'Validation error',
          issues: parseResult.error.issues, // 👈 ZodIssue[]
        });
        return;
      }

      const entry = await createDirectoryEntry.execute(parseResult.data);

      res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  });

  app.get(
    '/entries/search',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const parseResult = searchDirectoryEntriesQuerySchema.safeParse(req.query);

        if (!parseResult.success) {
          res.status(400).json({
            message: 'Validation error',
            issues: parseResult.error.issues, // 👈 same here
          });
          return;
        }

        const { q } = parseResult.data;

        const results = await searchDirectoryEntries.execute({ query: q });
        res.status(200).json(results);
      } catch (err) {
        next(err);
      }
    },
  );

  // Basic error handler
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    },
  );

  return app;
}

export const app = createApp();
