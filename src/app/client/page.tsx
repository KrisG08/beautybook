'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Heart, Bell } from 'lucide-react';
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
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        fetchFavorites(userData.id);
      } catch {}
    }
  }, []);

  const fetchFavorites = async (userId: string) => {
    try {
      const res = await fetch(`/api/data/favorites?userId=${userId}`);
      if (res.ok) {
        const favs = await res.json();
        setFavorites(favs.map((f: any) => f.businessId));
      }
    } catch {
      const storedFavs = localStorage.getItem('favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/data/client-notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch {}
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await fetch('/api/data/client-notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const toggleFavorite = async (businessId: string) => {
    if (!user) return;
    const wasFavorite = favorites.includes(businessId);
    setFavorites(prev => wasFavorite ? prev.filter(id => id !== businessId) : [...prev, businessId]);
    try {
      if (wasFavorite) {
        await fetch(`/api/data/favorites?userId=${user.id}&businessId=${businessId}`, { method: 'DELETE' });
      } else {
        await fetch('/api/data/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, businessId }),
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
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
    if (user) {
      fetchNotifications(user.id);
      const interval = setInterval(() => fetchNotifications(user.id), 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
              flex: 1,
            }}>
              LASTMINUTE
            </span>
            <motion.button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) markAllRead();
              }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: showNotifications ? '#140755' : 'rgba(20, 7, 85, 0.08)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={22} stroke={showNotifications ? '#fdfcd2' : '#140755'} fill={unreadCount > 0 ? '#ff6b9d' : 'none'} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#ff6b9d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'white',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </motion.button>
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

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(18, 18, 42, 0.98)',
              borderBottom: '1px solid rgba(42, 42, 74, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 20px', maxWidth: 430, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fdfcd2', margin: 0 }}>Notifications</h3>
                <span style={{ fontSize: 12, color: '#6a6a8a' }}>{notifications.length} total</span>
              </div>
              {notifications.length === 0 ? (
                <p style={{ fontSize: 13, color: '#6a6a8a', textAlign: 'center', padding: 20 }}>No notifications yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => notif.actionUrl && router.push(notif.actionUrl)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        background: notif.read ? 'rgba(26, 26, 58, 0.5)' : 'rgba(255, 107, 157, 0.1)',
                        border: `1px solid ${notif.read ? '#2a2a4a' : '#ff6b9d44'}`,
                        cursor: notif.actionUrl ? 'pointer' : 'default',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: notif.type === 'slot_available' ? '#00d4ff' : notif.type === 'favorite_update' ? '#ff6b9d' : '#fdfcd2' }}>
                          {notif.title}
                        </span>
                        {!notif.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b9d' }} />}
                      </div>
                      <p style={{ fontSize: 12, color: '#b8b8d0', margin: 0, lineHeight: 1.4 }}>{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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