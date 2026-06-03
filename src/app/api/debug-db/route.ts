import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'not set';
  const isSQLite = dbUrl.includes('file:');
  
  let dbInfo: any = {
    databaseUrl: dbUrl,
    type: isSQLite ? 'SQLite (LOCAL FILE)' : 'Remote Database',
    warning: isSQLite ? 'CRITICAL: Using local SQLite file. Each device has its own separate database!' : 'OK: Using remote database',
  };

  if (isSQLite) {
    // Get the actual file path
    const dbPath = dbUrl.replace('file:', '');
    const resolvedPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
    
    try {
      const stats = fs.statSync(resolvedPath);
      dbInfo.dbFilePath = resolvedPath;
      dbInfo.dbFileSize = `${(stats.size / 1024).toFixed(1)} KB`;
      dbInfo.dbLastModified = stats.mtime.toISOString();
    } catch (e) {
      dbInfo.dbFileError = 'Could not stat db file';
    }
  }

  // Count records
  try {
    const [userCount, businessCount, pendingCount] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.business.count({ where: { status: 'pending' } }),
    ]);
    dbInfo.userCount = userCount;
    dbInfo.businessCount = businessCount;
    dbInfo.pendingBusinessCount = pendingCount;
    dbInfo.timestamp = new Date().toISOString();
  } catch (e: any) {
    dbInfo.error = e.message;
  }

  console.log('[DEBUG-DB]', JSON.stringify(dbInfo, null, 2));
  
  return NextResponse.json(dbInfo, { status: 200 });
}
