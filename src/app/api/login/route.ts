import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = 'lastminute-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // If user has an associated business, ensure role is 'business'
    let finalRole = user.role;
    if (finalRole !== 'admin') {
      const associatedBusiness = await prisma.business.findUnique({
        where: { userId: user.id }
      });
      if (associatedBusiness && finalRole !== 'business') {
        finalRole = 'business';
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'business' }
        });
      }
    }

    const token = sign({ userId: user.id, role: finalRole }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: finalRole },
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
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}