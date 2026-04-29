'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { ClientBottomNav, Button } from '@/components/UI';

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

export default function ClientHelp() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmitContact = () => {
    alert('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', message: '' });
    setShowContactForm(false);
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
          <h1 style={{ fontSize: 28, color: colors.textPrimary }}>Help & Support</h1>
        </div>

        <p style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 24 }}>
          Find answers to common questions or get in touch with our support team.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          <div style={{ 
            background: colors.surface, 
            borderRadius: 16, 
            padding: 20,
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 16, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} stroke={colors.accent} /> Frequently Asked Questions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { q: 'How do I book an appointment?', a: 'Browse businesses, select a service, choose a time, and confirm your booking.' },
                { q: 'How can I cancel or reschedule?', a: 'Go to Account > Bookings, select your booking, and choose Cancel or Reschedule.' },
                { q: 'What payment methods are accepted?', a: 'We accept credit cards, debit cards, and digital wallets like Apple Pay and Google Pay.' },
                { q: 'How do I leave a review?', a: 'After your appointment, you\'ll receive a prompt to rate and review your experience.' },
                { q: 'Is my personal information secure?', a: 'Yes, we use encryption and never share your data with third parties.' },
              ].map((faq, index) => (
                <div 
                  key={index}
                  style={{
                    background: colors.background,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
                      {faq.q}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={20} stroke={colors.textMuted} />
                    ) : (
                      <ChevronDown size={20} stroke={colors.textMuted} />
                    )}
                  </button>
                  {openFaq === index && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16, textAlign: 'center' }}>
          💬 Need instant help? Tap the AI Assistant button on the bottom right!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, color: colors.textPrimary, marginBottom: 8 }}>Other Ways to Contact</h3>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            padding: 16, 
            background: colors.surface, 
            borderRadius: 12,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 12, 
              background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <Mail size={24} stroke="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>Email Support</div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>support@lastminute.com</div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            padding: 16, 
            background: colors.surface, 
            borderRadius: 12,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 12, 
              background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <Phone size={24} stroke={colors.primary} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>Phone Support</div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>1-800-LASTMIN (Mon-Fri 9am-6pm)</div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowContactForm(!showContactForm)}
          variant="secondary"
          style={{ width: '100%' }}
        >
          {showContactForm ? 'Hide Contact Form' : 'Send Us a Message'}
        </Button>

        {showContactForm && (
          <div style={{ 
            marginTop: 16, 
            background: colors.surface, 
            borderRadius: 16, 
            padding: 20,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8, display: 'block' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Enter your name"
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
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="Enter your email"
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
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 14,
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.textPrimary,
                    fontSize: 16,
                    resize: 'none',
                  }}
                />
              </div>
              
              <Button onClick={handleSubmitContact} style={{ width: '100%' }}>
                Send Message
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <ClientBottomNav active="account" />
    </div>
  );
}