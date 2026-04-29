'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Save } from 'lucide-react';
import { ClientBottomNav, Button, Input } from '@/components/UI';
import { useStore } from '@/lib/store';

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  accent2: '#00d4ff',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export default function ClientSettings() {
  const router = useRouter();
  const { currentUser } = useStore();
  const [hydratedUser, setHydratedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setHydratedUser(user);
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        }));
      } catch {}
    }
  }, []);

  const activeUser = currentUser || hydratedUser;

  const handleSave = () => {
    if (activeUser) {
      localStorage.setItem('user', JSON.stringify({ ...activeUser, ...formData }));
      alert('Settings saved successfully!');
      router.push('/client');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} stroke={colors.textPrimary} />
          </button>
          <h1 style={{ fontSize: 28, color: colors.textPrimary }}>Account Settings</h1>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: 16,
              background: activeTab === 'profile' ? colors.surface : 'transparent',
              border: `1px solid ${activeTab === 'profile' ? colors.primary : colors.border}`,
              borderRadius: 12,
              color: activeTab === 'profile' ? colors.primary : colors.textMuted,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{
              flex: 1,
              padding: 16,
              background: activeTab === 'security' ? colors.surface : 'transparent',
              border: `1px solid ${activeTab === 'security' ? colors.primary : colors.border}`,
              borderRadius: 12,
              color: activeTab === 'security' ? colors.primary : colors.textMuted,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Security
          </button>
        </div>

        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ 
              background: colors.surface, 
              borderRadius: 16, 
              padding: 20,
              border: `1px solid ${colors.border}`
            }}>
              <h3 style={{ fontSize: 18, marginBottom: 16, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={20} stroke={colors.accent} /> Personal Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ 
              background: colors.surface, 
              borderRadius: 16, 
              padding: 20,
              border: `1px solid ${colors.border}`
            }}>
              <h3 style={{ fontSize: 18, marginBottom: 16, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={20} stroke={colors.accent} /> Change Password
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: 14,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.textPrimary,
                      fontSize: 16,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          style={{ width: '100%', marginTop: 24 }}
        >
          <Save size={20} />
          Save Changes
        </Button>
      </motion.div>

      <ClientBottomNav active="account" />
    </div>
  );
}