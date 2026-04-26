'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { registerUser, loginUser } from '@/lib/actions';
import { useAuth } from '@/lib/authContext';

const COLORS = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  border: '#E8DDC7',
  success: '#059669',
  error: '#DC2626',
};

export default function AuthPage() {
  const router = useRouter();
  const { user, login: setAuthUser } = useAuth();
  
  // Individual state for each field - avoids object reference issues
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'business' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Individual form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('hair');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable callback - doesn't recreate on render
  const handleRoleSelect = useCallback((selectedRole: 'client' | 'business' | 'admin') => {
    setRole(selectedRole);
    if (mode === 'signup') {
      setName('');
      setBusinessName('');
      setContactPerson('');
      setAddress('');
      setCategory('hair');
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      if (role === 'business') {
        if (!businessName || !contactPerson || !address) {
          setError('Please fill in all required business fields');
          setLoading(false);
          return;
        }
      }
      if (role === 'admin') {
        if (password !== 'admin123') {
          setError('Invalid admin code');
          setLoading(false);
          return;
        }
      }
      
      const result = await registerUser(
        role === 'business' ? businessName : name || 'User',
        email,
        password,
        phone,
        role,
        businessName,
        contactPerson,
        address,
        category
      );
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      if (result.user) {
        setAuthUser(result.user);
        if (role === 'business') {
          router.push('/business/apply');
        } else {
          router.push(role === 'admin' ? '/admin' : '/client');
        }
      }
    } else {
      const result = await loginUser(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (result.user) {
        setAuthUser(result.user);
        router.push(result.user.role === 'admin' ? '/admin' : result.user.role === 'business' ? '/business' : '/client');
      }
    }
    setLoading(false);
  };

const BusinessFields = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Business Name *</label>
        <input 
          type="text" 
          value={businessName} 
          onChange={(e) => setBusinessName(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
          placeholder="Studio 22 Barbershop" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Contact Person *</label>
        <input 
          type="text" 
          value={contactPerson} 
          onChange={(e) => setContactPerson(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
          placeholder="John Doe" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Address *</label>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
          placeholder="Plovdiv, Bulgaria" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }}
        >
          <option value="hair">Hair & Barber</option>
          <option value="nails">Nails</option>
          <option value="aesthetic">Aesthetic</option>
        </select>
      </div>
    </div>
  );

  const AdminFields = () => (
    <div style={{ padding: 16, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: 0 }}>
        Enter admin access code to continue
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
      <div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={COLORS.textMuted} />
          <span style={{ fontSize: 14, color: COLORS.textMuted }}>Back</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', fontWeight: 800, marginBottom: 8 }}>
            LastMinute
          </h1>
          <p style={{ color: COLORS.textSecondary }}>Beauty booking in Plovdiv</p>
        </div>

        {/* Role Selection */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['client', 'business', 'admin'] as const).map((r) => (
            <div key={r} onClick={() => handleRoleSelect(r)} style={{
              flex: 1, padding: '12px 8px', borderRadius: 14, whiteSpace: 'nowrap',
              background: role === r ? COLORS.primary : 'white',
              border: `2px solid ${role === r ? COLORS.primary : COLORS.border}`, 
              fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              {r === 'client' && <User size={16} />}
              {r === 'business' && <Store size={16} />}
              {r === 'admin' && <Shield size={16} />}
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </div>
          ))}
        </div>

        {/* Login/Signup Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'white', padding: 4, borderRadius: 16 }}>
          <button onClick={() => setMode('login')} style={{
            flex: 1, padding: '12px 24px', borderRadius: 14, border: 'none',
            background: mode === 'login' ? COLORS.primary : 'transparent',
            color: COLORS.textPrimary, fontWeight: 700, cursor: 'pointer'
          }}>
            Sign In
          </button>
          <button onClick={() => setMode('signup')} style={{
            flex: 1, padding: '12px 24px', borderRadius: 14, border: 'none',
            background: mode === 'signup' ? COLORS.primary : 'transparent',
            color: COLORS.textPrimary, fontWeight: 700, cursor: 'pointer'
          }}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' && role === 'client' && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Name</label>
              <input 
                type="text" 
                name="name" 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
                placeholder="Your name" 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Email</label>
            <input 
              type="email" 
              name="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              autoComplete="off"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
              {role === 'admin' ? 'Admin Code' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                autoComplete="off"
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16, paddingRight: 48 }} 
                placeholder={role === 'admin' ? 'admin123' : '••••••••'} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                {showPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && role === 'client' && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Phone (optional)</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="off"
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 16 }} 
                placeholder="+359..." 
              />
            </div>
          )}

          {/* Role-specific fields */}
          {mode === 'signup' && role === 'business' && <BusinessFields />}
          {mode === 'signup' && role === 'admin' && <AdminFields />}

          {error && <p style={{ color: COLORS.error, fontSize: 14 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: COLORS.primary,
            color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : role === 'business' ? 'Create Business Account' : role === 'admin' ? 'Access Admin' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}