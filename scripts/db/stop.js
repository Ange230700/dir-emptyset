#!/usr/bin/env node
import { run } from './utils.js';

console.log('🛑 Stopping Postgres...');
await run('docker', ['compose', 'stop', 'db']);
console.log('✅ DB stopped');
