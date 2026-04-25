'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
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
  error: '#E57373',
};

export default function ClientAuth() {
  const router = useRouter();
  const { login, register } = useStore();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const success = login(email, password);
      if (success) {
        router.push('/client');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!name || !email || !password || !phone) {
        setError('Please fill in all fields');
        return;
      }
      register(name, email, password, phone);
      router.push('/client');
    }
  };

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
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: 32 }}>
          {mode === 'login' ? 'Sign in to continue' : 'Join us to book beauty services'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="input"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-000-0000"
                    className="input"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: colors.textPrimary }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: colors.error, fontSize: 14, marginBottom: 16 }}>{error}</p>
          )}

          <Button type="submit" style={{ width: '100%', marginBottom: 16 }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: colors.textMuted }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <span
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            style={{ color: colors.primary, cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}