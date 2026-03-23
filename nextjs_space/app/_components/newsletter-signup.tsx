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
    <section id="newsletter" className="py-16 relative overflow-hidden scroll-mt-32">
      {/* Blue gradient background */}
      <div className="absolute inset-0 blue-gradient" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-5">
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            Stay in the Game
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
            Get the latest pickleball news, tournament updates, and exclusive content delivered to your inbox.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-white bg-white/15 rounded-xl px-6 py-4 max-w-md mx-auto">
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
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/15 text-white placeholder-white/50 border border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3.5 bg-white text-brand-blue font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg uppercase tracking-wider text-sm"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-200 mt-3">
              <AlertCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}
          <p className="text-white/50 text-xs mt-5">Your data is safe with us. We respect your privacy.</p>
        </motion.div>
      </div>
    </section>
  );
}
