#!/usr/bin/env node
import { run } from './utils.js';

console.log('🚀 Starting Postgres (DIR∅ Directory DB)...');

await run('docker', ['compose', 'up', '-d', 'db']);

// Wait for pg_isready
console.log('⏳ Waiting for DB to accept connections...');

let ready = false;
while (!ready) {
  try {
    await run('docker', ['exec', 'dir_directory_db', 'pg_isready', '-U', 'postgres']);
    ready = true;
  } catch {
    await new Promise((r) => setTimeout(r, 300));
  }
}

console.log('✅ DB ready at localhost:5432');
