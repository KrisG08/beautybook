'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, Store, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getAllBusinesses } from '@/lib/actions';

const colors = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  success: '#059669',
  warning: '#D97706',
};

export default function AdminHome() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getAllBusinesses();
      setBusinesses(data);
    }
    loadData();
  }, []);

  if (!user) {
    router.push('/auth');
    return null;
  }

  const totalBusinesses = businesses.filter(b => b.status === 'approved').length;
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length;
  
  const menuItems = [
    { id: 'businesses', label: 'Businesses', icon: Store, count: totalBusinesses, color: colors.primary, path: '/admin/businesses' },
    { id: 'pending', label: 'Pending', icon: Store, count: pendingBusinesses, color: colors.warning, path: '/admin/businesses?status=pending' },
    { id: 'users', label: 'Users', icon: Users, count: 156, color: colors.success, path: '/admin/users' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: 89, color: colors.warning, path: '/admin/bookings' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/auth')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: colors.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={32} stroke={colors.primary} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>Welcome, {user.name}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.primary }}>{totalBusinesses}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Businesses</div>
          </div>
          <div style={{ background: 'white', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.success }}>156</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Users</div>
          </div>
          <div style={{ background: 'white', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.warning }}>89</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Bookings</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {menuItems.map((item) => (
            <motion.div key={item.id} onClick={() => router.push(item.path)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'white', borderRadius: 16, cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={24} stroke="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{item.label}</h3>
                <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>{item.count} total</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}