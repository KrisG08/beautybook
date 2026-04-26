'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

const COLORS = {
  primary: '#FFD600',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  border: '#E8DDC7',
};

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      router.replace(user.role === 'admin' ? '/admin' : user.role === 'business' ? '/business' : '/client');
    }
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 60 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.8 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, background: COLORS.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <Sparkles size={40} color={COLORS.textPrimary} />
            </div>
          </motion.div>
          
          <h1 style={{ fontSize: 36, fontFamily: 'Playfair Display, serif', fontWeight: 800, marginBottom: 8 }}>
            LastMinute
          </h1>
          <p style={{ fontSize: 18, color: COLORS.textSecondary, marginBottom: 40 }}>
            Book beauty services in seconds
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320, margin: '0 auto' }}>
            <motion.button onClick={() => router.push('/auth')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: COLORS.primary,
              color: COLORS.textPrimary, fontSize: 18, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255, 214, 0, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              Get Started <ArrowRight size={20} />
            </motion.button>
          </div>

          <p style={{ marginTop: 32, fontSize: 13, color: COLORS.textSecondary }}>
            Trusted by 500+ beauty businesses in Plovdiv
          </p>
        </div>
      </motion.div>
    </div>
  );
}