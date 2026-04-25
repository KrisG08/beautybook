'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Percent, Settings } from 'lucide-react';
import { Button, Input } from '@/components/UI';

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
};

export default function AdminSettings() {
  const router = useRouter();
  const [commission, setCommission] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Settings</h1>
        </div>

        <div style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Percent size={24} stroke={colors.primary} />
            <h3 style={{ fontSize: 18, color: colors.textPrimary }}>Commission Settings</h3>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              className="input"
              min={1}
              max={50}
            />
            <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
              This percentage is charged per booking to all businesses
            </p>
          </div>

          <Button
            onClick={handleSave}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <DollarSign size={16} />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        <div style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Settings size={24} stroke={colors.primary} />
            <h3 style={{ fontSize: 18, color: colors.textPrimary }}>Platform Settings</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, background: colors.secondary, borderRadius: 12 }}>
              <h4 style={{ fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>Booking Window</h4>
              <p style={{ fontSize: 14, color: colors.textMuted }}>1 day to 7 days in advance</p>
            </div>
            
            <div style={{ padding: 16, background: colors.secondary, borderRadius: 12 }}>
              <h4 style={{ fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>Cancellation Policy</h4>
              <p style={{ fontSize: 14, color: colors.textMuted }}>24 hours before appointment</p>
            </div>
            
            <div style={{ padding: 16, background: colors.secondary, borderRadius: 12 }}>
              <h4 style={{ fontWeight: 600, marginBottom: 4, color: colors.textPrimary }}>Payment Processing</h4>
              <p style={{ fontSize: 14, color: colors.textMuted }}>Weekly payouts on Fridays</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}