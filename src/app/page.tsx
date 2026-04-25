'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, ChevronRight, Zap, Flame } from 'lucide-react';

const colors = {
  primary: '#FFD600',
  primaryDark: '#FFC107',
  surface: '#FFFFFF',
  textPrimary: '#111111',
  textMuted: '#999999',
};

export default function LandingPage() {
  const router = useRouter();

  const roles = [
    { id: 'client', label: 'Client', icon: User, description: 'Book in 60 seconds' },
    { id: 'business', label: 'Business', icon: Store, description: 'Get more bookings' },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Manage platform' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '80px 16px 40px', background: '#FFFFFF' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          marginBottom: 12,
          padding: '8px 16px',
          background: '#111111',
          borderRadius: 20,
          width: 'fit-content'
        }}>
          <Flame size={16} fill={colors.primary} stroke={colors.primary} />
          <span style={{ color: colors.primary, fontWeight: 700, fontSize: 14 }}>LastMinute</span>
        </div>

        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          <h1 style={{ fontSize: 42, marginBottom: 8, color: colors.textPrimary, fontWeight: 800, lineHeight: 1.1 }}>
            Book beauty<br />
            <span style={{ color: colors.primary }}>in seconds</span>
          </h1>
          <p style={{ fontSize: 16, color: colors.textMuted }}>
            Available now. Near you.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                gap: 16,
                padding: 20,
                background: colors.surface,
                borderRadius: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                border: '2px solid #F5F5F5',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <role.icon size={26} color="#111111" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 17, marginBottom: 2, color: colors.textPrimary, fontWeight: 700 }}>
                  {role.label}
                </h3>
                <p style={{ fontSize: 13, color: colors.textMuted }}>
                  {role.description}
                </p>
              </div>
              <ChevronRight size={20} color={colors.textMuted} />
            </motion.div>
          ))}
        </div>

        <div style={{ 
          marginTop: 40, 
          padding: 20, 
          background: '#111111', 
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              ⚡ Last available slots
            </p>
            <p style={{ color: colors.textMuted, fontSize: 13 }}>
              Book before they're gone
            </p>
          </div>
          <Zap size={28} fill={colors.primary} stroke={colors.primary} />
        </div>
      </motion.div>
    </div>
  );
}