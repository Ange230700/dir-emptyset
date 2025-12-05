#!/usr/bin/env node
import { run } from './utils.js';

console.log('🔄 Restarting Postgres...');
await run('docker', ['compose', 'restart', 'db']);

console.log('⏳ Waiting for DB to be ready...');
let ready = false;
while (!ready) {
  try {
    await run('docker', ['exec', 'dir_directory_db', 'pg_isready', '-U', 'postgres']);
    ready = true;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
  }
}

console.log('✅ DB restarted and ready');
