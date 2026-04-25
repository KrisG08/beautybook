'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, LogOut, Settings, HelpCircle, ChevronRight } from 'lucide-react';
import { ClientBottomNav, Button } from '@/components/UI';
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

const menuItems = [
  { id: 'profile', label: 'Edit Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function ClientAccount() {
  const router = useRouter();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: colors.textPrimary }}>
          Account
        </h1>

        {currentUser ? (
          <>
            <div style={{
              background: colors.surface,
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <User size={40} stroke={colors.surface} />
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 4, color: colors.textPrimary }}>
                {currentUser.name}
              </h2>
              <p style={{ fontSize: 14, color: colors.textMuted }}>
                {currentUser.email}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    background: colors.surface,
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  <item.icon size={20} stroke={colors.textMuted} />
                  <span style={{ flex: 1, color: colors.textPrimary }}>{item.label}</span>
                  <ChevronRight size={16} stroke={colors.textMuted} />
                </motion.div>
              ))}
            </div>

            <Button
              variant="secondary"
              onClick={handleLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: colors.textMuted, marginBottom: 24 }}>Sign in to view your account</p>
            <Button onClick={() => router.push('/client/auth')} style={{ marginBottom: 12 }}>
              Sign In
            </Button>
            <Button variant="secondary" onClick={() => router.push('/client/auth')}>
              Create Account
            </Button>
          </div>
        )}
      </motion.div>

      <ClientBottomNav active="account" />
    </div>
  );
}