'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, User, Phone, Mail, MapPin, FileText, CheckCircle } from 'lucide-react';

const COLORS = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
  border: '#E8DDC7',
  error: '#E57373',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function BusinessApply() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<any>(null);
  
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          contactPerson: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        }));
        checkExistingBusiness(userData.id);
      } catch {}
    } else {
      router.push('/auth');
    }
  }, []);

  const checkExistingBusiness = async (userId: string) => {
    try {
      const res = await fetch(`/api/data/businesses?userId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const biz = data[0];
        setExistingBusiness(biz);
        setFormData({
          name: biz.name || '',
          contactPerson: biz.contactPerson || '',
          phone: biz.phone || '',
          email: biz.email || '',
          address: biz.address || '',
          description: biz.description || '',
          category: biz.category || 'hair',
        });
      }
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    setError('');

    try {
      if (existingBusiness) {
        const res = await fetch(`/api/data/business?businessId=${existingBusiness.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            status: 'pending',
          }),
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        const res = await fetch('/api/data/businesses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userId: user.id,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create');
        }
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
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
            width: 80, height: 80, borderRadius: '50%', 
            background: '#E8F5E9', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={40} stroke="#4CAF50" />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: COLORS.textPrimary }}>
            Application Submitted!
          </h1>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
            Your business application is now pending review. An admin will approve it shortly.
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
          {existingBusiness ? 'Edit Your Application' : 'Complete Your Application'}
        </h1>
        <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 32 }}>
          {existingBusiness ? 'Update your business details and resubmit for approval.' : 'Fill in your business details to submit for approval.'}
        </p>

        {error && (
          <div style={{ padding: 14, borderRadius: 12, background: '#FFEBEE', marginBottom: 20, fontSize: 14, color: COLORS.error }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Business Name *</label>
            <input
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Glamour Studio"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Contact Person *</label>
            <input
              type="text" required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Your name"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Phone *</label>
            <input
              type="tel" required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+359 88 123 4567"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Address *</label>
            <input
              type="text" required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Business address"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, boxSizing: 'border-box' }}
            >
              <option value="hair">Hair</option>
              <option value="nails">Nails</option>
              <option value="massage">Massage</option>
              <option value="skincare">Skincare</option>
              <option value="makeup">Makeup</option>
              <option value="aesthetics">Aesthetics</option>
              <option value="beauty">Beauty</option>
              <option value="lashes">Lashes</option>
              <option value="pmu">PMU</option>
              <option value="laser">Laser</option>
              <option value="physiotherapy">Physiotherapy</option>
              <option value="spa">Spa</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14, color: COLORS.textPrimary }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your business..."
              rows={3}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, background: COLORS.surface, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={submitting} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: COLORS.primary,
            color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1, marginTop: 8,
          }}>
            {submitting ? 'Submitting...' : existingBusiness ? 'Update & Resubmit' : 'Submit Application'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
