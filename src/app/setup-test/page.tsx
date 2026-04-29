'use client';

import { useEffect, useState } from 'react';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export default function SetupTestPage() {
  const [status, setStatus] = useState('Setting up...');

  useEffect(() => {
    async function setup() {
      try {
        // This would normally call the API
        setStatus('Please use /api/setup-test to setup test data');
      } catch (e) {
        setStatus('Error: ' + String(e));
      }
    }
    setup();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a1a', 
      color: '#fdfcd2', 
      padding: 40, 
      fontFamily: 'system-ui' 
    }}>
      <h1>Setup Test Data</h1>
      <p>{status}</p>
      <a href="/api/setup-test" style={{ color: '#00d4ff' }}>Click here to setup</a>
    </div>
  );
}