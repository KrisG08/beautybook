'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Store, ClipboardList, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getBusinessByUserId } from '@/lib/actions';

const colors = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  border: '#E8DDC7',
  success: '#059669',
  warning: '#D97706',
};

export default function BusinessHome() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    if (userData.role !== 'business') {
      router.push(userData.role === 'admin' ? '/admin' : '/client');
      return;
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !user) return;
    async function loadBusiness() {
      if (user) {
        const biz = await getBusinessByUserId(user.id);
        setBusiness(biz);
      }
      setLoading(false);
    }
    loadBusiness();
  }, [mounted, user]);

  if (!mounted || !user) return null;

  if (loading) {
    return <div style={{ minHeight: '100vh', background: colors.background, padding: 60, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/auth')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Store size={32} stroke={colors.textPrimary} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Business Portal</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>{user.name}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!business ? (
            <motion.div onClick={() => router.push('/business/apply')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'white', borderRadius: 16, cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={28} stroke={colors.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Apply to List Your Business</h3>
                <p style={{ fontSize: 14, color: colors.textMuted }}>Start accepting bookings today</p>
              </div>
            </motion.div>
          ) : business.status === 'pending' ? (
            <div style={{ padding: 24, background: 'white', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: colors.surface, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={32} stroke={colors.primary} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: colors.textPrimary }}>Pending Approval</h3>
              <p style={{ color: colors.textMuted }}>Your application is under review. We'll notify you once approved.</p>
            </div>
          ) : business.status === 'approved' ? (
            <>
              <motion.div onClick={() => router.push('/business/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'white', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={28} stroke={colors.textPrimary} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Dashboard</h3>
                  <p style={{ fontSize: 14, color: colors.textMuted }}>Manage bookings and schedule</p>
                </div>
              </motion.div>

              {!business.bankAccount && (
                <motion.div onClick={() => router.push('/business/onboarding')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'white', borderRadius: 16, cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: '#C9A87C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={28} stroke="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Complete Setup</h3>
                    <p style={{ fontSize: 14, color: colors.textMuted }}>Connect bank account to receive payments</p>
                  </div>
                </motion.div>
              )}
            </>
          ) : business.status === 'rejected' ? (
            <div style={{ padding: 24, background: '#FEE2E2', borderRadius: 16, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: '#DC2626' }}>Application Rejected</h3>
              <p style={{ color: colors.textMuted }}>Your application was not approved. Please contact support.</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}