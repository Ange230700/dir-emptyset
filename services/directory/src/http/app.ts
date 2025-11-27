// services\directory\src\http\app.ts

import express, { type Request, type Response, type NextFunction } from 'express';

import { PrismaDirectoryRepository } from '../infrastructure/repositories/PrismaDirectoryRepository.js';
import { CreateDirectoryEntry } from '../application/use-cases/CreateDirectoryEntry.js';
import { SearchDirectoryEntries } from '../application/use-cases/SearchDirectoryEntries.js';

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
      const { name, email, tags } = req.body ?? {};

      if (!name || !email || !Array.isArray(tags)) {
        res.status(400).json({
          message: 'Invalid payload. Expected { name: string, email: string, tags: string[] }',
        });
        return;
      }

      const entry = await createDirectoryEntry.execute({
        name: String(name),
        email: String(email),
        tags: tags.map(String),
      });

      res.status(201).json(entry);
      return;
    } catch (err) {
      // You can branch on known domain errors later (e.g., duplicate email)
      next(err);
    }
  });

  app.get(
    '/entries/search',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const rawQ = req.query.q;

        // Only accept plain string `q`, reject arrays/objects
        if (typeof rawQ !== 'string') {
          res.status(400).json({ message: 'Query parameter "q" must be a string' });
          return;
        }

        const q = rawQ.trim();
        if (!q) {
          res.status(400).json({ message: 'Missing query parameter "q"' });
          return;
        }

        const results = await searchDirectoryEntries.execute({ query: q });
        res.status(200).json(results);
        return;
      } catch (err) {
        next(err);
      }
    },
  );

  // Basic error handler
  // (you can replace with nicer problem-details JSON later)
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
