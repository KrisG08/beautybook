import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}