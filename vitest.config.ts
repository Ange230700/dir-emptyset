// vitest.config.ts

import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,

    // Look for tests in the current project tree (works from root or a package)
    include: ['**/*.test.ts', '**/*.spec.ts'],

    // Use Vitest defaults (which already exclude node_modules, etc.)
    // then add your own folders.
    exclude: [...configDefaults.exclude, 'dist', 'build', 'coverage'],

    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/dir_directory?schema=public',
    },
  },
});
