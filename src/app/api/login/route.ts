import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = 'lastminute-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log(`[LOGIN] Attempt: email=${email}`);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`[LOGIN] Failed: user not found: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`[LOGIN] Failed: wrong password for: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log(`[LOGIN] Success: ${user.name} (${user.role})`);

    const response = NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
    
    response.cookies.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('[LOGIN] ERROR:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}