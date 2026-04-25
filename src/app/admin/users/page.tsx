'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, Mail, Phone } from 'lucide-react';
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
};

export default function AdminUsers() {
  const router = useRouter();
  const { users } = useStore();

  const mockUsers = [
    { id: 'u1', name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', role: 'client', createdAt: new Date('2024-01-15') },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', role: 'client', createdAt: new Date('2024-02-20') },
    { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 555-0103', role: 'client', createdAt: new Date('2024-03-10') },
    { id: 'u4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 555-0104', role: 'client', createdAt: new Date('2024-04-05') },
    { id: 'u5', name: 'Tom Brown', email: 'tom@example.com', phone: '+1 555-0105', role: 'client', createdAt: new Date('2024-05-12') },
  ];

  const allUsers = [...users, ...mockUsers];

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <motion.div
            onClick={() => router.push('/admin')}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} stroke={colors.textPrimary} />
          </motion.div>
          <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Users</h1>
        </div>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search users..."
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

        <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16 }}>
          {allUsers.length} users
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {allUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                background: colors.surface,
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: colors.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={24} stroke={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>
                    {user.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mail size={12} stroke={colors.textMuted} />
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{user.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Phone size={12} stroke={colors.textMuted} />
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{user.phone}</span>
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: 12,
                  background: colors.secondary,
                  color: colors.primary,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {user.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}