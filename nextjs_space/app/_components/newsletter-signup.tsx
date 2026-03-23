"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSignup() {
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
    <section className="py-16 bg-gradient-to-r from-brand-purple to-brand-purple-dark">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Mail size={40} className="text-brand-neon mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            Stay in the Game
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Get the latest pickleball news, tournament updates, and exclusive content delivered to your inbox.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-brand-neon">
              <CheckCircle size={20} />
              <span className="font-semibold">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-brand-neon focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-brand-neon text-brand-purple font-bold rounded-lg hover:bg-brand-neon-dim transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-400 mt-3">
              <AlertCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}
          <p className="text-white/40 text-xs mt-4">Your data is safe with us. We respect your privacy.</p>
        </motion.div>
      </div>
    </section>
  );
}
