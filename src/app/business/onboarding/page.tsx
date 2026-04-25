'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Building, Check, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/UI';
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
  error: '#E57373',
};

export default function BusinessOnboarding() {
  const router = useRouter();
  const { currentUser, businesses } = useStore();
  
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankData, setBankData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const userBusiness = businesses.find(b => b.userId === currentUser?.id);

  const handleSubmit = () => {
    if (!agreed || !bankData.bankName || !bankData.accountNumber) {
      return;
    }
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: 40 }}
        >
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: colors.success,
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Check size={40} stroke={colors.surface} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: colors.textPrimary }}>
            Setup Complete!
          </h1>
          <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 32 }}>
            Your bank account has been connected. You can now start receiving payments.
          </p>
          <Button onClick={() => router.push('/business')}>
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          onClick={() => router.back()}
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
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={20} stroke={colors.textPrimary} />
        </motion.div>

        <h1 style={{ fontSize: 28, marginBottom: 8, color: colors.textPrimary }}>
          Payment Setup
        </h1>
        <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 32 }}>
          Connect your bank account to receive payments from bookings
        </p>

        <div style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CreditCard size={24} stroke={colors.primary} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                Commission Fee
              </h3>
              <p style={{ fontSize: 14, color: colors.textMuted }}>
                10% per booking
              </p>
            </div>
          </div>
          
          <div style={{
            padding: 16,
            background: colors.secondary,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <AlertCircle size={20} stroke={colors.accent} />
            <div style={{ fontSize: 14, color: colors.textSecondary }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Payment Schedule</p>
              <p>Payments are processed weekly. You'll receive earnings every Friday for the previous week's bookings.</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowBankModal(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Building size={20} />
          Connect Bank Account
        </Button>

        <div style={{ marginTop: 24 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 4 }}
            />
            <span style={{ fontSize: 14, color: colors.textSecondary }}>
              I agree to the platform terms and understand the 10% commission fee per booking.
            </span>
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!agreed}
          variant="secondary"
          style={{ width: '100%', marginTop: 24 }}
        >
          Complete Setup
        </Button>
      </motion.div>

      <AnimatePresence>
        {showBankModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overlay"
            onClick={() => setShowBankModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bottom-sheet"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '80vh', overflow: 'auto' }}
            >
              <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Connect Bank Account</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankData.bankName}
                  onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                  placeholder="Bank of America"
                  className="input"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankData.accountHolderName}
                  onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                  placeholder="John Doe"
                  className="input"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                  placeholder="••••••••"
                  className="input"
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
                  Routing Number
                </label>
                <input
                  type="text"
                  value={bankData.routingNumber}
                  onChange={(e) => setBankData({ ...bankData, routingNumber: e.target.value })}
                  placeholder="••••••••"
                  className="input"
                />
              </div>

              <Button
                onClick={() => setShowBankModal(false)}
                style={{ width: '100%' }}
              >
                Save Bank Account
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}