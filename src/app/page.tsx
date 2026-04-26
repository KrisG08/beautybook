'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, ChevronRight, Zap } from 'lucide-react';

const colors = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  textPrimary: '#2A241C',
  textMuted: '#6B6358',
};

export default function LandingPage() {
  const router = useRouter();

  const roles = [
    { id: 'client', label: 'Client', icon: User, description: 'Book in 60 seconds' },
    { id: 'business', label: 'Business', icon: Store, description: 'Get more bookings' },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Manage platform' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF5' }}>
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#2A241C',
            padding: '10px 20px',
            borderRadius: 24,
            marginBottom: 24
          }}>
            <Zap size={18} fill={colors.primary} stroke={colors.primary} />
            <span style={{ color: colors.primary, fontWeight: 700, fontSize: 15 }}>LastMinute</span>
          </div>

          <h1 style={{ 
            fontSize: 36, 
            fontFamily: 'Playfair Display, serif',
            marginBottom: 12, 
            color: colors.textPrimary,
            fontWeight: 800,
            lineHeight: 1.2
          }}>
            Book beauty<br/>
            <span style={{ color: '#2A241C' }}>in seconds</span>
          </h1>
          <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 0 }}>
            Available now. Near you.
          </p>
        </motion.div>
      </div>

      {/* Role Selection */}
      <div style={{ padding: '0 20px 40px', maxWidth: 430, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
                  borderRadius: 20,
                  cursor: 'pointer',
                  border: '1px solid #E8DDC7',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
                whileHover={{ scale: 1.01, y: -2 }}
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
                  <role.icon size={26} color="#2A241C" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, marginBottom: 2, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                    {role.label}
                  </h3>
                  <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>
                    {role.description}
                  </p>
                </div>
                <ChevronRight size={20} color={colors.textMuted} />
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              marginTop: 32,
              padding: 20,
              background: '#2A241C',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                ⚡ Last available slots
              </p>
              <p style={{ color: colors.textMuted, fontSize: 13, margin: 0 }}>
                Book before they're gone
              </p>
            </div>
            <Zap size={28} fill={colors.primary} stroke={colors.primary} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}