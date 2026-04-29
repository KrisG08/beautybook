'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessHome() {
  const router = useRouter();

  useEffect(() => {
    router.push('/business/dashboard');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a1a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ color: '#fdfcd2' }}>Loading...</div>
    </div>
  );
}