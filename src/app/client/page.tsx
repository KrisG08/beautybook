'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Heart } from 'lucide-react';
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
  { id: 'makeup', name: 'Makeup', icon: 'Makeup', color: '#ffab91' },
  { id: 'brows', name: 'Brows', icon: 'Brows', color: '#ce93d8' },
];

export default function ClientHome() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const storedFavs = localStorage.getItem('favorites');
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    }
  }, []);

  const toggleFavorite = (businessId: string) => {
    const newFavs = favorites.includes(businessId)
      ? favorites.filter(id => id !== businessId)
      : [...favorites, businessId];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

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
      <div style={{
        background: 'linear-gradient(135deg, #fffb99 0%, #fdfcd2 30%, #fff8b8 60%, #fffde6 100%)',
        padding: '60px 20px 40px',
        borderRadius: '0 0 30px 30px',
        marginBottom: 24,
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 430, margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              marginBottom: 20,
            }}
          >
            <img 
              src="/logolastminute.png" 
              alt="LastMinute" 
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 14,
                objectFit: 'cover',
                boxShadow: '0 4px 15px rgba(20, 7, 85, 0.2)',
              }}
            />
            <span style={{ 
              fontWeight: 900, 
              fontSize: 18, 
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #140755 0%, #2a1a8a 50%, #3d2ab8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              LASTMINUTE
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: 28, 
              fontFamily: 'Playfair Display, serif', 
              marginBottom: 12, 
              fontWeight: 900, 
              lineHeight: 1.2,
              color: '#140755',
            }}
          >
            Find your <br />
            <span style={{
              background: 'linear-gradient(135deg, #140755 0%, #2a1a8a 50%, #3d2ab8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>perfect service</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="search-bar" 
            onClick={() => router.push('/client/search')} 
            style={{ cursor: 'pointer', marginTop: 16 }}
          >
            <Search size={20} stroke={colors.textMuted} />
            <span style={{ color: colors.primary, fontSize: 14 }}>Search services, salons...</span>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: '20px 20px', maxWidth: 430, margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 20 }}
        >
          <div className="filter-chip active" onClick={() => router.push('/client/search')}>Available Now</div>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="filter-chip" onClick={() => router.push(`/client/search?category=${cat.id}`)}>
              {cat.name}
            </div>
          ))}
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 14, fontWeight: 800 }}
        >
          Browse by service
        </motion.h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
            >
              <CategoryCard
                category={category}
                onClick={() => router.push(`/client/search?category=${category.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {favorites.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 24 }}
          >
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', fontWeight: 800 }}>
              <Heart size={18} fill={colors.accent} stroke={colors.accent} style={{ marginRight: 6 }} /> Your Favorites
            </h2>
          </motion.div>
        )}

        {favorites.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
            {businesses.filter(b => favorites.includes(b.id)).slice(0, 3).map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.75 + index * 0.1 }}
              >
                <BusinessCard
                  business={business}
                  onClick={() => router.push(`/client/location/${business.id}`)}
                  isFavorite={favorites.includes(business.id)}
                  onFavoriteClick={() => toggleFavorite(business.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/client/search')}
          style={{
            marginTop: 24,
            padding: 20,
            background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)',
            borderRadius: 24,
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(253, 252, 210, 0.3)',
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 900, fontFamily: 'Playfair Display, serif', color: colors.secondary }}>
            Book in 60 seconds
          </p>
          <p style={{ fontSize: 12, color: 'rgba(20, 7, 85, 0.7)', marginTop: 4, fontWeight: 600 }}>
            Tap to find available appointments
          </p>
        </motion.div>
      </div>

      <ClientBottomNav active="home" />
    </div>
  );
}