'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, Store, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getAllBusinesses } from '@/lib/actions';

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
  border: '#2a2a4a',
};

export default function AdminHome() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [businesses, setBusinesses] = useState<any[]>([]);
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
    if (userData.role !== 'admin') {
      router.push(userData.role === 'business' ? '/business' : '/client');
      return;
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const data = await getAllBusinesses();
      setBusinesses(data);
    }
    loadData();
  }, [mounted]);

  if (!mounted || !user) return null;

  const totalBusinesses = businesses.filter(b => b.status === 'approved').length;
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length;
  
  const menuItems = [
    { id: 'businesses', label: 'Businesses', icon: Store, count: totalBusinesses, color: colors.secondary, path: '/admin/businesses' },
    { id: 'pending', label: 'Pending', icon: Store, count: pendingBusinesses, color: colors.secondary, path: '/admin/businesses?status=pending' },
    { id: 'users', label: 'Users', icon: Users, count: 156, color: colors.secondary, path: '/admin/users' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: 89, color: colors.secondary, path: '/admin/bookings' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/auth')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={32} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: colors.primary, fontWeight: 900 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>Welcome, {user.name}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.secondary }}>{totalBusinesses}</div>
            <div style={{ fontSize: 12, color: colors.secondary, opacity: 0.7 }}>Businesses</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.secondary }}>156</div>
            <div style={{ fontSize: 12, color: colors.secondary, opacity: 0.7 }}>Users</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.secondary }}>89</div>
            <div style={{ fontSize: 12, color: colors.secondary, opacity: 0.7 }}>Bookings</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {menuItems.map((item) => (
            <motion.div key={item.id} onClick={() => router.push(item.path)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(253, 252, 210, 0.3)'
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={24} stroke={colors.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: colors.secondary }}>{item.label}</h3>
                <p style={{ fontSize: 12, color: colors.secondary, opacity: 0.7, margin: 0 }}>{item.count} total</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}