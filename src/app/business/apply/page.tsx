'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, User, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const COLORS = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  border: '#E8DDC7',
};

export default function BusinessApply() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    category: 'hair',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/auth');
    }
  }, [mounted, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Business already created during registration, just show success
    setSubmitted(true);
  };

  if (!mounted || !user) return null;

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: 40 }}
        >
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: COLORS.surface,
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Store size={40} stroke={COLORS.primary} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: COLORS.textPrimary }}>
            Application Submitted!
          </h1>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
            Thank you for applying. We'll review your application and get back to you within 24-48 hours.
          </p>
          <button onClick={() => router.push('/business')} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: COLORS.primary,
            color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}>
            Back to Portal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '40px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/business')} style={{
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <ArrowLeft size={20} color={COLORS.textMuted} />
          <span style={{ fontSize: 14, color: COLORS.textMuted }}>Back</span>
        </button>

        <h1 style={{ fontSize: 28, marginBottom: 8, color: COLORS.textPrimary }}>
          Complete Your Application
        </h1>
        <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
          Your business profile has been created. Click submit to send for approval.
        </p>

        <form onSubmit={handleSubmit}>
          <button type="submit" style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: COLORS.primary,
            color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}>
            Submit Application
          </button>
        </form>
      </motion.div>
    </div>
  );
}