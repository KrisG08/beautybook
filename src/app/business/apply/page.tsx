'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, User, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { Button, Input } from '@/components/UI';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/types';

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

export default function BusinessApply() {
  const router = useRouter();
  const { currentUser, addBusiness } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    category: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addBusiness({
      userId: currentUser?.id || 'temp',
      name: formData.name,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      description: formData.description,
      category: formData.category,
      commission: 10,
    });
    
    setSubmitted(true);
  };

  if (submitted) {
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
            background: colors.secondary,
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Store size={40} stroke={colors.primary} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 12, color: colors.textPrimary }}>
            Application Submitted!
          </h1>
          <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 32 }}>
            Thank you for applying. We'll review your application and get back to you within 24-48 hours.
          </p>
          <Button onClick={() => router.push('/business')}>
            Back to Home
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
          Apply to List Your Business
        </h1>
        <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 32 }}>
          Fill out the form below to get started
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Business Name
            </label>
            <div style={{ position: 'relative' }}>
              <Store size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Business Name"
                className="input"
                style={{ paddingLeft: 40 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Contact Person
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Full Name"
                className="input"
                style={{ paddingLeft: 40 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-000-0000"
                className="input"
                style={{ paddingLeft: 40 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="business@example.com"
                className="input"
                style={{ paddingLeft: 40 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Business Address
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State"
                className="input"
                style={{ paddingLeft: 40 }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>
              Description
            </label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: 12 }} />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your business..."
                className="input"
                style={{ paddingLeft: 40, minHeight: 100, resize: 'vertical' }}
                required
              />
            </div>
          </div>

          <Button type="submit" style={{ width: '100%' }}>
            Submit Application
          </Button>
        </form>
      </motion.div>
    </div>
  );
}