'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Store, ClipboardList, PlusCircle } from 'lucide-react';
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

export default function BusinessHome() {
  const router = useRouter();
  const { currentUser, businesses } = useStore();
  
  const userBusiness = businesses.find(b => b.userId === currentUser?.id);

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          marginBottom: 32 
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Store size={32} stroke={colors.surface} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Business Portal</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>Manage your beauty business</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!userBusiness ? (
            <motion.div
              onClick={() => router.push('/business/apply')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 24,
                background: colors.surface,
                borderRadius: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: colors.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ClipboardList size={28} stroke={colors.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>
                  Apply to List Your Business
                </h3>
                <p style={{ fontSize: 14, color: colors.textMuted }}>
                  Start accepting bookings today
                </p>
              </div>
            </motion.div>
          ) : userBusiness.status === 'pending' ? (
            <div style={{
              padding: 24,
              background: colors.surface,
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                background: colors.secondary,
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ClipboardList size={32} stroke={colors.primary} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: colors.textPrimary }}>
                ClipboardList Pending
              </h3>
              <p style={{ color: colors.textMuted }}>
                Your application is under review. We'll notify you once approved.
              </p>
            </div>
          ) : userBusiness.status === 'approved' ? (
            <>
              <motion.div
                onClick={() => router.push('/business/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 24,
                  background: colors.surface,
                  borderRadius: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
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
                  <PlusCircle size={28} stroke={colors.surface} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>
                    Dashboard
                  </h3>
                  <p style={{ fontSize: 14, color: colors.textMuted }}>
                    Manage bookings and schedule
                  </p>
                </div>
              </motion.div>

              {userBusiness.status === 'approved' && !userBusiness.bankAccount && (
                <motion.div
                  onClick={() => router.push('/business/onboarding')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 24,
                    background: colors.surface,
                    borderRadius: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Store size={28} stroke={colors.surface} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>
                      Complete Setup
                    </h3>
                    <p style={{ fontSize: 14, color: colors.textMuted }}>
                      Connect bank account to receive payments
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}