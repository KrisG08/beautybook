'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Store, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { registerUser, loginUser } from '@/lib/actions';
import { useAuth } from '@/lib/authContext';

const COLORS = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
  success: '#00e676',
  error: '#ff5252',
};

function BusinessFields({ 
  businessName, setBusinessName, 
  contactPerson, setContactPerson, 
  address, setAddress, 
  category, setCategory 
}: {
  businessName: string; setBusinessName: (v: string) => void;
  contactPerson: string; setContactPerson: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  category: string; setCategory: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Business Name *</label>
        <input 
          type="text" 
          value={businessName} 
          onChange={(e) => setBusinessName(e.target.value)}
          style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
          placeholder="Studio 22 Barbershop" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Contact Person *</label>
        <input 
          type="text" 
          value={contactPerson} 
          onChange={(e) => setContactPerson(e.target.value)}
          style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
          placeholder="John Doe" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Address *</label>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
          placeholder="Plovdiv, Bulgaria" 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }}
        >
          <option value="hair">Hair</option>
          <option value="nails">Nails</option>
          <option value="skin">Skin</option>
          <option value="massage">Massage</option>
        </select>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'business' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('hair');

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
        if (adminKey !== 'admin123') {
          setError('Invalid admin access code');
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
        router.push(role === 'business' ? '/business/apply' : role === 'admin' ? '/admin' : '/client');
      }
    } else {
      const result = await loginUser(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (result.user) {
        const dbRole = result.user.role;
        
        // Validate selected role matches database role
        if ((role === 'business' && dbRole !== 'business') || 
            (role === 'admin' && dbRole !== 'admin') ||
            (role === 'client' && dbRole !== 'client' && dbRole !== 'business' && dbRole !== 'admin')) {
          setError(`This account is not registered as ${role}. Please select the correct role.`);
          setLoading(false);
          return;
        }
        
        const userWithRole = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: dbRole
        };
        setAuthUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        
        if (userWithRole.role === 'admin') {
          router.push('/admin');
        } else if (userWithRole.role === 'business') {
          router.push('/business');
        } else {
          router.push('/client');
        }
      }
    }
    setLoading(false);
  };

  const handleRoleChange = (newRole: 'client' | 'business' | 'admin') => {
    setRole(newRole);
    if (mode === 'signup') {
      setName('');
      setBusinessName('');
      setContactPerson('');
      setAddress('');
      setCategory('hair');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '40px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={COLORS.textMuted} />
          <span style={{ fontSize: 14, color: COLORS.textMuted }}>Back</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 16 }}
          >
            <img 
              src="/logolastminute.png" 
              alt="LastMinute" 
              style={{ 
                width: 100,
                height: 100,
                borderRadius: 28,
                objectFit: 'cover',
                display: 'block',
                margin: '0 auto 16px'
              }}
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 32, fontFamily: 'Playfair Display, serif', fontWeight: 900, marginBottom: 8, color: COLORS.textPrimary }}
          >
            LastMinute
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ color: COLORS.textSecondary, fontSize: 15, fontWeight: 500 }}
          >
            Beauty booking in Plovdiv ⚡
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: 10, marginBottom: 28 }}
        >
          <button onClick={() => handleRoleChange('client')} style={{
            flex: 1, padding: '14px 10px', borderRadius: 16, whiteSpace: 'nowrap',
            background: role === 'client' ? `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)` : COLORS.surface,
            border: `2px solid ${role === 'client' ? 'transparent' : COLORS.border}`, 
            color: role === 'client' ? COLORS.secondary : COLORS.textMuted, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14
          }}>
            <User size={16} />Client
          </button>
          <button onClick={() => handleRoleChange('business')} style={{
            flex: 1, padding: '14px 10px', borderRadius: 16, whiteSpace: 'nowrap',
            background: role === 'business' ? `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)` : COLORS.surface,
            border: `2px solid ${role === 'business' ? 'transparent' : COLORS.border}`, 
            color: role === 'business' ? COLORS.secondary : COLORS.textMuted, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14
          }}>
            <Store size={16} />Business
          </button>
          <button onClick={() => handleRoleChange('admin')} style={{
            flex: 1, padding: '14px 10px', borderRadius: 16, whiteSpace: 'nowrap',
            background: role === 'admin' ? `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)` : COLORS.surface,
            border: `2px solid ${role === 'admin' ? 'transparent' : COLORS.border}`, 
            color: role === 'admin' ? COLORS.secondary : COLORS.textMuted, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14
          }}>
            <Shield size={16} />Admin
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 8, marginBottom: 28, background: COLORS.surface, padding: 6, borderRadius: 20 }}
        >
          <button onClick={() => setMode('login')} style={{
            flex: 1, padding: '14px 28px', borderRadius: 16, border: 'none',
            background: mode === 'login' ? `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)` : 'transparent',
            color: mode === 'login' ? COLORS.secondary : COLORS.textMuted, fontWeight: 700, cursor: 'pointer', fontSize: 15
          }}>
            Sign In
          </button>
          <button onClick={() => setMode('signup')} style={{
            flex: 1, padding: '14px 28px', borderRadius: 16, border: 'none',
            background: mode === 'signup' ? `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)` : 'transparent',
            color: mode === 'signup' ? COLORS.secondary : COLORS.textMuted, fontWeight: 700, cursor: 'pointer', fontSize: 15
          }}>
            Sign Up
          </button>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          {mode === 'signup' && role === 'client' && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
                placeholder="Your name" 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary, paddingRight: 52 }} 
                placeholder={role === 'admin' ? 'admin123' : '••••••••'} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                {showPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && role === 'client' && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Phone (optional)</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
                placeholder="+359..." 
              />
            </div>
          )}

          {mode === 'signup' && role === 'admin' && (
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: COLORS.textSecondary }}>Admin Access Code *</label>
              <input 
                type="password" 
                value={adminKey} 
                onChange={(e) => setAdminKey(e.target.value)}
                required
                style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.surface, fontSize: 16, color: COLORS.textPrimary }} 
                placeholder="Enter admin code" 
              />
            </div>
          )}

          {mode === 'signup' && role === 'business' && (
            <BusinessFields 
              businessName={businessName} setBusinessName={setBusinessName}
              contactPerson={contactPerson} setContactPerson={setContactPerson}
              address={address} setAddress={setAddress}
              category={category} setCategory={setCategory}
            />
          )}

          {error && <p style={{ color: COLORS.error, fontSize: 14, fontWeight: 600 }}>{error}</p>}

          <motion.button 
            type="submit" 
            disabled={loading} 
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%', padding: '18px', borderRadius: 20, border: 'none', 
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, #fffb99 100%)`,
              color: COLORS.secondary, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 8,
              boxShadow: '0 8px 24px rgba(253, 252, 210, 0.3)'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : role === 'business' ? 'Create Business Account' : role === 'admin' ? 'Access Admin' : 'Create Account'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}