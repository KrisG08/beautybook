'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Clock } from 'lucide-react';

const COLORS = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
};

interface Business {
  id: string;
  name: string;
  contactPerson: string;
  address: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: string;
  imageUrl?: string;
  serviceCount?: number;
  priceRange?: { min: number; max: number };
  todaySlots?: number;
}

export default function BusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/data/businesses');
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  const approvedBusinesses = businesses.filter(b => b.status === 'approved');

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
      <div style={{ maxWidth: 430, margin: '0 auto' }}>
        <button onClick={() => router.push('/auth')} style={{
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span style={{ fontSize: 14, color: COLORS.textMuted }}>← Back</span>
        </button>

        <h1 style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', fontWeight: 800, marginBottom: 8 }}>
          All Businesses
        </h1>
        <p style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
          {approvedBusinesses.length} businesses in Plovdiv
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.textMuted }}>
            Loading...
          </div>
        ) : approvedBusinesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: COLORS.textMuted }}>No businesses yet</p>
            <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Be the first to register!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {approvedBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => router.push(`/client/location/${business.id}`)}
                style={{
                  background: COLORS.surface,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.border}`,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }}
              >
                {business.imageUrl && (
                  <div style={{
                    height: 140,
                    backgroundImage: `url(${business.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>
                      {business.name}
                    </h3>
                    <span style={{
                      padding: '4px 10px',
                      background: COLORS.surface,
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      color: COLORS.textSecondary,
                    }}>
                      {business.category}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <MapPin size={14} stroke={COLORS.textMuted} />
                    <span style={{ fontSize: 14, color: COLORS.textMuted }}>{business.address}</span>
                  </div>
                  
                  <p style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 }}>
                    {business.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill={COLORS.primary} stroke={COLORS.primary} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{business.rating.toFixed(1)}</span>
                      <span style={{ fontSize: 14, color: COLORS.textMuted }}>({business.reviewCount})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} stroke={COLORS.accent} />
                      <span style={{ fontSize: 14, color: COLORS.textSecondary }}>
                        {business.todaySlots ? `${business.todaySlots} slots` : 'Available'}
                      </span>
                    </div>
                  </div>

                  {business.priceRange && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      paddingTop: 12, 
                      borderTop: `1px solid ${COLORS.border}`,
                      fontSize: 13
                    }}>
                      <span style={{ color: COLORS.textSecondary }}>
                        {business.serviceCount} services
                      </span>
                      <span style={{ fontWeight: 700, color: COLORS.primary }}>
                        ${business.priceRange.min} - ${business.priceRange.max}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}