'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ClientBottomNav, BusinessCard, FilterChip } from '@/components/UI';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';
import { format, addDays } from 'date-fns';

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

const SERVICE_TYPES = ['Hair', 'Nails', 'Skin', 'Massage', 'Makeup', 'Brows'];
const SUBTYPES = ['Regular', 'Gel Polish', 'Spa', 'Standard', 'Moisturizing', 'Relaxation', 'Therapeutic', 'Natural', 'Glamour', 'Threading'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function ClientSearch() {
  const router = useRouter();
  const { businesses, filters, setFilters } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(b => {
    if (b.status !== 'approved') return false;
    if (filters.serviceType && b.category !== filters.serviceType) return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid ' + colors.secondary,
                borderRadius: 12,
                fontSize: 14,
                background: colors.surface,
              }}
            />
          </div>
          <motion.div
            onClick={() => setShowFilters(!showFilters)}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: filters.serviceType ? colors.primary : colors.surface,
              border: '2px solid ' + (filters.serviceType ? colors.primary : colors.secondary),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={20} stroke={filters.serviceType ? colors.surface : colors.textMuted} />
          </motion.div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: 16, background: colors.surface, borderRadius: 16, marginBottom: 16 }}>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 12, color: colors.textSecondary }}>Service Type</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <FilterChip
                      label="All"
                      selected={!filters.serviceType}
                      onClick={() => setFilters({ serviceType: null })}
                    />
                    {SERVICE_TYPES.map((type) => (
                      <FilterChip
                        key={type}
                        label={type}
                        selected={filters.serviceType === type.toLowerCase()}
                        onClick={() => setFilters({ serviceType: type.toLowerCase() })}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 12, color: colors.textSecondary }}>Date</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {dates.map((date) => (
                      <FilterChip
                        key={date.toISOString()}
                        label={format(date, 'EEE, MMM d')}
                        selected={filters.date === format(date, 'yyyy-MM-dd')}
                        onClick={() => setFilters({ date: format(date, 'yyyy-MM-dd') })}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 12, color: colors.textSecondary }}>Time</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TIME_SLOTS.map((time) => (
                      <FilterChip
                        key={time}
                        label={time}
                        selected={filters.time === time}
                        onClick={() => setFilters({ time: filters.time === time ? null : time })}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowFilters(false)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: colors.primary,
                    color: colors.surface,
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filters.serviceType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: colors.textMuted }}>Filtered by:</span>
            <FilterChip
              label={filters.serviceType + ' ×'}
              selected={true}
              onClick={() => setFilters({ serviceType: null })}
            />
            <FilterChip
              label={filters.date ? format(new Date(filters.date), 'MMM d') + ' ×' : 'All dates'}
              selected={false}
              onClick={() => setFilters({ date: null })}
            />
          </div>
        )}

        <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16 }}>
          {filteredBusinesses.length} businesses found
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <BusinessCard
                business={business}
                onClick={() => router.push(`/client/location/${business.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: colors.textMuted }}>No businesses found</p>
            <p style={{ color: colors.textMuted, fontSize: 14 }}>Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      <ClientBottomNav active="search" />
    </div>
  );
}