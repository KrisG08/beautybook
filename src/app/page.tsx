'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, ChevronRight } from 'lucide-react';

const colors = {
  primary: '#E8B4B8',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textMuted: '#9A9595',
};

export default function LandingPage() {
  const router = useRouter();

  const roles = [
    { id: 'client', label: 'Client', icon: User, description: 'Book beauty services' },
    { id: 'business', label: 'Business', icon: Store, description: 'Offer your services' },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Manage platform' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '60px 16px 40px', background: '#FFFBFA' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, marginBottom: 12, color: colors.textPrimary }}>
            LastMinute
          </h1>
          <p style={{ fontSize: 16, color: colors.textMuted }}>
            Your beauty services, on demand
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => router.push(`/${role.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: 24,
                background: colors.surface,
                borderRadius: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <role.icon size={28} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, marginBottom: 4, color: colors.textPrimary }}>
                  {role.label}
                </h3>
                <p style={{ fontSize: 14, color: colors.textMuted }}>
                  {role.description}
                </p>
              </div>
              <ChevronRight size={20} color={colors.textMuted} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}