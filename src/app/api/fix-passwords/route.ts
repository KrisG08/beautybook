import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'fix-passwords-2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Hash the passwords
    const hashedTest = await bcrypt.hash('test123', 10);
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedBusiness = await bcrypt.hash('business123', 10);

    // Update users with hashed passwords
    await prisma.user.update({
      where: { email: 'test@lastminute.bg' },
      data: { password: hashedTest }
    });

    await prisma.user.update({
      where: { email: 'admin@lastminute.bg' },
      data: { password: hashedAdmin }
    });

    await prisma.user.update({
      where: { email: 'business@lastminute.bg' },
      data: { password: hashedBusiness }
    });

    return NextResponse.json({ 
      message: 'Passwords fixed! Now you can login.',
      users: [
        { email: 'admin@lastminute.bg', password: 'admin123', role: 'admin' },
        { email: 'business@lastminute.bg', password: 'business123', role: 'business' },
        { email: 'test@lastminute.bg', password: 'test123', role: 'client' }
      ]
    });
  } catch (error) {
    console.error('Fix passwords error:', error);
    return NextResponse.json({ 
      error: 'Failed to fix passwords', 
      details: String(error) 
    }, { status: 500 });
  }
}