'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Zap, Clock, TrendingUp } from 'lucide-react';
import { ClientBottomNav, CategoryCard, BusinessCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

const colors = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
};

export default function ClientHome() {
  const router = useRouter();
  const { businesses } = useStore();

  const approvedBusinesses = businesses.filter(b => b.status === 'approved').slice(0, 6);

  return (
    <div style={{ background: colors.background, minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <div className="hero">
        <div style={{ padding: '16px 0' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#2A241C',
            padding: '8px 16px',
            borderRadius: 20,
            marginBottom: 20
          }}>
            <Zap size={14} fill={colors.primary} stroke={colors.primary} />
            <span style={{ color: colors.primary, fontWeight: 700, fontSize: 13 }}>LastMinute</span>
          </div>

          <h1 style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', marginBottom: 8, fontWeight: 800 }}>
            Find <span style={{ color: colors.primary, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>available</span> now
          </h1>
          
          <div className="search-bar" onClick={() => router.push('/client/search')} style={{ cursor: 'pointer' }}>
            <Search size={20} stroke={colors.textMuted} />
            <span style={{ color: colors.textMuted, fontSize: 15 }}>Search services...</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px', maxWidth: 430, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16 }}>
          <div className="filter-chip active">⚡ Available Now</div>
          {CATEGORIES.slice(0, 4).map((cat) => (
            <div key={cat.id} className="filter-chip" onClick={() => router.push('/client/search')}>
              {cat.name}
            </div>
          ))}
        </div>

        {/* Urgency Banner */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 24,
          padding: 14,
          background: '#2A241C',
          borderRadius: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} fill={colors.primary} stroke={colors.primary} />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>🔥 Filling fast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} fill={colors.primary} stroke={colors.primary} />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>⚡ 30 min wait</span>
          </div>
        </div>

        {/* Categories */}
        <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 14, fontWeight: 700 }}>
          Browse by service
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryCard
                category={category}
                onClick={() => router.push('/client/search')}
              />
            </motion.div>
          ))}
        </div>

        {/* Popular */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
            🔥 Popular right now
          </h2>
          <TrendingUp size={18} stroke={colors.primary} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {approvedBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BusinessCard
                business={business}
                onClick={() => router.push(`/client/location/${business.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/client/search')}
          style={{
            marginTop: 24,
            padding: 24,
            background: colors.primary,
            borderRadius: 24,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Playfair Display, serif', color: colors.textPrimary }}>
            ⚡ Book in 60 seconds
          </p>
          <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
            Tap to find available appointments
          </p>
        </motion.div>
      </div>

      <ClientBottomNav active="home" />
    </div>
  );
}