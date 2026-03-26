"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success');
        setMessage(data?.message ?? 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data?.error ?? 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section id="newsletter" className="py-16 relative overflow-hidden scroll-mt-32">
      {/* Navy background with green accent */}
      <div className="absolute inset-0 bg-brand-purple" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/5 via-transparent to-brand-neon/5" />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-neon/15 mb-5">
            <Mail size={28} className="text-brand-neon" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            {t('newsletter.title')}
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
            {t('newsletter.subtitle')}
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-brand-neon bg-brand-neon/10 rounded-xl px-6 py-4 max-w-md mx-auto border border-brand-neon/20">
              <CheckCircle size={20} />
              <span className="font-semibold">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                placeholder={t('newsletter.placeholder')}
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 focus:border-brand-neon focus:outline-none focus:ring-2 focus:ring-brand-neon/20 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3.5 bg-brand-neon text-brand-purple-dark font-bold rounded-xl hover:bg-brand-neon-dim transition-all disabled:opacity-50 shadow-lg shadow-brand-neon/20 uppercase tracking-wider text-sm"
              >
                {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.subscribe')}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-300 mt-3">
              <AlertCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}
          <p className="text-white/40 text-xs mt-5">{t('newsletter.privacy')}</p>
        </motion.div>
      </div>
    </section>
  );
}
