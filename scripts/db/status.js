#!/usr/bin/env node
import { run } from './utils.js';
import { execSync } from 'node:child_process';

console.log('📡 Checking DB status...');

try {
  const output = execSync("docker ps --format '{{.Names}}'").toString();
  const isRunning = output.includes('dir_directory_db');

  if (!isRunning) {
    console.log('❌ DB container is NOT running');
    process.exit(1);
  }

  console.log('🔍 DB container found, checking readiness...');

  await run('docker', ['exec', 'dir_directory_db', 'pg_isready', '-U', 'postgres']);
  console.log('✅ DB is running and accepts connections');
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}
