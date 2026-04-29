import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'create-test-2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash('test123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedBusinessPassword = await bcrypt.hash('business123', 10);

    // Create test admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lastminute.bg',
        password: hashedAdminPassword,
        phone: '+359885000000',
        role: 'admin',
      }
    });

    // Create test business user
    const businessUser = await prisma.user.create({
      data: {
        name: 'Business Owner',
        email: 'business@lastminute.bg',
        password: hashedBusinessPassword,
        phone: '+359885000002',
        role: 'business',
      }
    });

    // Create test client user
    const clientUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@lastminute.bg',
        password: hashedPassword,
        phone: '+359885000001',
        role: 'client',
      }
    });

    return NextResponse.json({ 
      message: 'All test users created with hashed passwords!',
      users: [
        { email: 'admin@lastminute.bg', password: 'admin123', role: 'admin' },
        { email: 'business@lastminute.bg', password: 'business123', role: 'business' },
        { email: 'test@lastminute.bg', password: 'test123', role: 'client' }
      ]
    });
  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json({ 
      error: 'Failed to create users', 
      details: String(error) 
    }, { status: 500 });
  }
}