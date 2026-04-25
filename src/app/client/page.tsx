'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ClientBottomNav, CategoryCard, BusinessCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

const colors = {
  primary: '#E8B4B8',
  secondary: '#F5E6E8',
  accent: '#C9A87C',
  background: '#FFFBFA',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
};

export default function ClientHome() {
  const router = useRouter();
  const { businesses, setSelectedCategory } = useStore();

  const availableBusinesses = businesses.filter(b => b.status === 'approved').slice(0, 4);

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ padding: '20px 0 16px', position: 'sticky', top: 0, background: colors.background, zIndex: 10 }}>
          <div
            onClick={() => router.push('/client/search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: colors.surface,
              borderRadius: 12,
              border: '2px solid ' + colors.secondary,
            }}
          >
            <Search size={20} stroke={colors.textMuted} />
            <span style={{ color: colors.textMuted }}>Search services...</span>
          </div>
        </div>

        <h2 style={{ fontSize: 24, marginBottom: 16, color: colors.textPrimary }}>
          Categories
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 12, 
          marginBottom: 32 
        }}>
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryCard
                category={category}
                onClick={() => {
                  setSelectedCategory(category.id);
                  router.push('/client/search');
                }}
              />
            </motion.div>
          ))}
        </div>

        <h2 style={{ fontSize: 24, marginBottom: 16, color: colors.textPrimary }}>
          Featured Businesses
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {availableBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BusinessCard
                business={business}
                onClick={() => router.push(`/client/location/${business.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ClientBottomNav active="home" />
    </div>
  );
}