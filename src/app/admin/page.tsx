'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, Store, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const colors = {
  primary: '#E8B4B8',
  secondary: '#F5E6E8',
  accent: '#C9A87C',
  background: '#FFFBFA',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
  success: '#7CB98B',
  warning: '#FFB74D',
};

export default function AdminHome() {
  const router = useRouter();
  const { users, businesses, bookings } = useStore();
  
  const totalUsers = users.length + 100;
  const totalBusinesses = businesses.filter(b => b.status === 'approved').length;
  const totalBookings = bookings.length;
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length;
  
  const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice * 0.1), 0);

  const menuItems = [
    { id: 'businesses', label: 'Businesses', icon: Store, count: totalBusinesses, color: colors.primary },
    { id: 'users', label: 'Users', icon: Users, count: totalUsers, color: colors.success },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: totalBookings, color: colors.warning },
  ];

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: colors.textPrimary }}>
          Admin Dashboard
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}>
            <Users size={24} stroke={colors.primary} />
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, marginTop: 8 }}>
              {totalUsers}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Total Users</div>
          </div>

          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}>
            <DollarSign size={24} stroke={colors.success} />
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.success, marginTop: 8 }}>
              ${revenue.toFixed(0)}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Total Revenue</div>
          </div>
        </div>

        {pendingBusinesses > 0 && (
          <motion.div
            onClick={() => router.push('/admin/businesses')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              background: colors.accent,
              borderRadius: 16,
              marginBottom: 24,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Store size={24} stroke={colors.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: colors.surface }}>
                {pendingBusinesses} Pending Applications
              </div>
              <div style={{ fontSize: 12, color: colors.surface, opacity: 0.8 }}>
                Review and approve new businesses
              </div>
            </div>
            <ChevronRight size={20} stroke={colors.surface} />
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => router.push(`/admin/${item.id}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20,
                background: colors.surface,
                borderRadius: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: colors.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <item.icon size={24} stroke={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: colors.textPrimary }}>{item.label}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{item.count} total</div>
              </div>
              <ChevronRight size={20} stroke={colors.textMuted} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}