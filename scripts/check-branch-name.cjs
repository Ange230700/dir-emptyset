#!/usr/bin/env node
// scripts/check-branch-name.cjs

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require('node:child_process');

if (process.env.CI) {
  console.log('CI environment detected, skipping branch name check.');
  process.exit(0);
}

// Run the same CLI you used to call from package.json
const result = spawnSync('validate-branch-name', {
  stdio: 'inherit',
  shell: true, // important for Windows so the command is resolved via the shell/PATH
});

if (result.error) {
  console.error('Failed to run validate-branch-name:', result.error);
}

// Forward the CLI's exit code (or 1 if Node didn't get a status)
process.exit(result.status === null ? 1 : result.status);
