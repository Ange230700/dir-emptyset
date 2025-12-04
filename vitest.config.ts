// vitest.config.ts

import { defineConfig, configDefaults } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const rootDir = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@apps': resolve(rootDir, 'apps'),
      '@services': resolve(rootDir, 'services'),
      '@packages': resolve(rootDir, 'packages'),
    },
  },
  test: {
    environment: 'node',
    globals: true,

    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: [...configDefaults.exclude, 'dist', 'build', 'coverage'],

    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/dir_directory?schema=public',
    },
  },
});
