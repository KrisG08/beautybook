'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const COLORS = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  border: '#2a2a4a',
};

export default function LandingPage() {
  const router = useRouter();
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/logolastminute.png';
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => setLogoLoaded(false);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 60 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 1, bounce: 0.5 }}>
            <img 
              src="/logolastminute.png" 
              alt="LastMinute Logo" 
              style={{
                width: 160,
                height: 160,
                borderRadius: 40,
                objectFit: 'cover',
                margin: '0 auto 28px',
                display: logoLoaded ? 'block' : 'none',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.display = 'block';
              }}
            />
            {!logoLoaded && (
              <div 
                style={{
                  width: 100, height: 100, borderRadius: 32, 
                  background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 50%, #ff6b9d 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px',
                  boxShadow: '0 8px 40px rgba(253, 252, 210, 0.3), 0 0 60px rgba(255, 107, 157, 0.2)'
                }}
              >
                <Sparkles size={48} color={COLORS.secondary} />
              </div>
            )}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 42, fontFamily: 'Playfair Display, serif', fontWeight: 900, marginBottom: 12, color: COLORS.textPrimary }}
          >
            LastMinute
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: COLORS.textSecondary, marginBottom: 48, fontWeight: 500 }}
          >
            Book beauty services in seconds ⚡
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340, margin: '0 auto' }}
          >
            <motion.button onClick={() => router.push('/auth')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              width: '100%', padding: '20px', borderRadius: 24, border: 'none', 
              background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)',
              color: COLORS.secondary, fontSize: 18, fontWeight: 800, cursor: 'pointer', 
              boxShadow: '0 8px 32px rgba(253, 252, 210, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              Get Started <ArrowRight size={22} />
            </motion.button>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 40, fontSize: 14, color: COLORS.textSecondary, fontWeight: 500 }}
          >
            ✨ Trusted by 50+ beauty businesses in Plovdiv
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}