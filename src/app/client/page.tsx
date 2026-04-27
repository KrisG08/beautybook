'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Zap, Clock, TrendingUp } from 'lucide-react';
import { ClientBottomNav, CategoryCard, BusinessCard } from '@/components/UI';

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  accent2: '#00d4ff',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
};

interface Business {
  id: string;
  name: string;
  address: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: string;
  imageUrl?: string;
}

const CATEGORIES = [
  { id: 'hair', name: 'Hair', icon: 'Hair', color: '#fdfcd2' },
  { id: 'nails', name: 'Nails', icon: 'Nails', color: '#ff6b9d' },
  { id: 'skin', name: 'Skin', icon: 'Skin', color: '#00d4ff' },
  { id: 'massage', name: 'Massage', icon: 'Massage', color: '#00e676' },
];

export default function ClientHome() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/auth');
      return;
    }
    const userData = JSON.parse(stored);
    if (userData.role !== 'client') {
      router.push(userData.role === 'admin' ? '/admin' : '/business');
      return;
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/data/businesses');
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [mounted]);

  if (!mounted || loading) return null;

  const approvedBusinesses = businesses.filter(b => b.status === 'approved').slice(0, 6);

  return (
    <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: 100 }}>
      <div className="hero">
        <div style={{ padding: '16px 0', position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              background: 'rgba(253, 252, 210, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '10px 18px',
              borderRadius: 24,
              marginBottom: 24,
              border: '1px solid rgba(253, 252, 210, 0.2)'
            }}
          >
            <Zap size={16} fill={colors.primary} stroke={colors.primary} />
            <span style={{ color: colors.primary, fontWeight: 800, fontSize: 13, letterSpacing: '0.5px' }}>LASTMINUTE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 32, fontFamily: 'Playfair Display, serif', marginBottom: 12, fontWeight: 900, lineHeight: 1.2 }}
          >
            Find your <br />
            <span className="gradient-text" style={{ textShadow: 'none' }}>perfect service</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="search-bar" 
            onClick={() => router.push('/client/search')} 
            style={{ cursor: 'pointer', marginTop: 20 }}
          >
            <Search size={22} stroke={colors.textMuted} />
            <span style={{ color: colors.textMuted, fontSize: 15 }}>Search services, salons...</span>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: '28px 20px', maxWidth: 430, margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 20 }}
        >
          <div className="filter-chip active">⚡ Available Now</div>
          {CATEGORIES.slice(0, 4).map((cat) => (
            <div key={cat.id} className="filter-chip" onClick={() => router.push('/client/search')}>
              {cat.name}
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ 
            display: 'flex', 
            gap: 16, 
            marginBottom: 28,
            padding: 18,
            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(20, 7, 85, 0.4) 100%)',
            borderRadius: 24,
            border: '1px solid rgba(255, 107, 157, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={18} fill={colors.accent} stroke={colors.accent} />
            <span style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 700 }}>🔥 Filling fast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} fill={colors.accent2} stroke={colors.accent2} />
            <span style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 700 }}>⚡ 30 min wait</span>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', marginBottom: 18, fontWeight: 800 }}
        >
          Browse by service
        </motion.h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 32 }}>
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
            >
              <CategoryCard
                category={category}
                onClick={() => router.push('/client/search')}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}
        >
          <h2 style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 800 }}>
            <span style={{ color: colors.accent }}>🔥</span> Popular now
          </h2>
          <TrendingUp size={20} stroke={colors.accent} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {approvedBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.65 + index * 0.1 }}
            >
              <BusinessCard
                business={business}
                onClick={() => router.push(`/client/location/${business.id}`)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/client/search')}
          style={{
            marginTop: 32,
            padding: 28,
            background: 'linear-gradient(135deg, var(--primary) 0%, #fffb99 100%)',
            borderRadius: 28,
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(253, 252, 210, 0.3)',
          }}
        >
          <p style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Playfair Display, serif', color: colors.secondary }}>
            ⚡ Book in 60 seconds
          </p>
          <p style={{ fontSize: 14, color: 'rgba(20, 7, 85, 0.7)', marginTop: 6, fontWeight: 600 }}>
            Tap to find available appointments
          </p>
        </motion.div>
      </div>

      <ClientBottomNav active="home" />
    </div>
  );
}