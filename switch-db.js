#!/usr/bin/env node
/**
 * Script to switch between local SQLite and Supabase PostgreSQL
 * 
 * Usage:
 *   node switch-db.js sqlite    - Switch to local SQLite
 *   node switch-db.js supabase - Switch to Supabase (requires DATABASE_URL in .env)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '.env');

const mode = process.argv[2];

if (!mode || !['sqlite', 'supabase'].includes(mode)) {
  console.log('Usage: node switch-db.js [sqlite|supabase]');
  console.log('  sqlite    - Switch to local SQLite database');
  console.log('  supabase  - Switch to Supabase PostgreSQL');
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');

if (mode === 'sqlite') {
  // Switch to SQLite
  schema = schema.replace(
    /provider\s*=\s*"[^"]*"/,
    'provider = "sqlite"'
  );
  schema = schema.replace(
    /url\s*=\s*"[^"]*"/,
    'url      = "file:./dev.db"'
  );
  
  // Update .env
  let env = '';
  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, 'utf8');
  }
  if (env.includes('DATABASE_URL=')) {
    env = env.replace(/DATABASE_URL="[^"]*"/, 'DATABASE_URL="file:./dev.db"');
  } else {
    env += '\nDATABASE_URL="file:./dev.db"\n';
  }
  fs.writeFileSync(envPath, env);
  
  console.log('Switched to SQLite (local file: ./dev.db)');
  
} else if (mode === 'supabase') {
  // Read DATABASE_URL from .env
  let env = '';
  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, 'utf8');
  }
  
  const match = env.match(/DATABASE_URL="([^"]+)"/);
  if (!match || match[1].includes('file:')) {
    console.error('ERROR: Set DATABASE_URL to your Supabase connection string in .env first!');
    console.error('Example: DATABASE_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"');
    process.exit(1);
  }
  
  // Switch to PostgreSQL
  schema = schema.replace(
    /provider\s*=\s*"[^"]*"/,
    'provider = "postgresql"'
  );
  
  console.log('Switched to PostgreSQL');
  console.log('Database URL:', match[1].replace(/:[^:@]+@/, ':***@'));
}

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated. Run: npx prisma db push && npx prisma generate');
