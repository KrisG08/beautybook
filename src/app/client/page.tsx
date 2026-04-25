'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Zap, Flame, TrendingUp } from 'lucide-react';
import { ClientBottomNav, CategoryCard, BusinessCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

const colors = {
  primary: '#FFD600',
  secondary: '#FFF8E1',
  surface: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#666666',
  textMuted: '#999999',
};

export default function ClientHome() {
  const router = useRouter();
  const { businesses } = useStore();

  const approvedBusinesses = businesses.filter(b => b.status === 'approved').slice(0, 6);

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div style={{ padding: '16px 0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '6px 12px',
              background: '#111111',
              borderRadius: 16,
            }}>
              <Flame size={14} fill={colors.primary} stroke={colors.primary} />
              <span style={{ color: colors.primary, fontWeight: 700, fontSize: 13 }}>LastMinute</span>
            </div>
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 8, color: colors.textPrimary, fontWeight: 800 }}>
            Find <span style={{ color: colors.primary }}>available</span> now
          </h1>
          
          {/* Search Bar */}
          <div
            onClick={() => router.push('/client/search')}
            className="search-bar"
          >
            <Search size={20} stroke={colors.textMuted} />
            <span style={{ color: colors.textMuted, fontSize: 15 }}>Search services...</span>
          </div>
        </div>

        {/* Quick Filters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            <div 
              className="filter-chip active"
              onClick={() => router.push('/client/search')}
            >
              ⚡ Available Now
            </div>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <div 
                key={cat.id}
                className="filter-chip"
                onClick={() => router.push('/client/search')}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Tags */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 24,
          padding: '12px 16px',
          background: '#111111',
          borderRadius: 16,
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
        <h2 style={{ fontSize: 18, marginBottom: 14, color: colors.textPrimary, fontWeight: 700 }}>
          Browse by service
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 12, 
          marginBottom: 28 
        }}>
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
          <h2 style={{ fontSize: 18, color: colors.textPrimary, fontWeight: 700 }}>
            🔥 Popular right now
          </h2>
          <TrendingUp size={18} stroke={colors.primary} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
            borderRadius: 20,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 800, color: '#111111' }}>
            ⚡ Book in 60 seconds
          </p>
          <p style={{ fontSize: 14, color: '#666666', marginTop: 4 }}>
            Tap to find available appointments
          </p>
        </motion.div>
      </motion.div>

      <ClientBottomNav active="home" />
    </div>
  );
}