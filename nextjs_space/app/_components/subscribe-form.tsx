"use client";
import React, { useState } from 'react';

interface SubscribeFormProps {
  source: 'article' | 'footer';
  variant?: 'inline' | 'footer';
}

export default function SubscribeForm({ source, variant = 'inline' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phoneNumber: phone.trim() || undefined, source }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? 'Thanks for subscribing!');
        setEmail('');
        setPhone('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`${
        variant === 'inline'
          ? 'bg-brand-purple rounded-2xl p-8 md:p-10 my-10 text-center'
          : 'text-center py-4'
      }`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-neon/20 mb-4">
          <svg className="w-6 h-6 text-brand-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className={`font-heading font-bold text-lg ${
          variant === 'inline' ? 'text-white' : 'text-brand-neon'
        }`}>
          {message}
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="font-heading font-bold text-white mb-2 uppercase text-sm tracking-wider">Stay Connected</h3>
        <p className="text-white/50 text-sm mb-3">Get updates, new editions & event alerts.</p>
        <input
          type="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-neon/50 transition-colors"
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-neon/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2.5 bg-brand-neon text-brand-purple font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {status === 'error' && <p className="text-red-400 text-xs">{message}</p>}
      </form>
    );
  }

  // Inline article variant
  return (
    <div className="bg-brand-purple rounded-2xl p-8 md:p-10 my-10">
      <div className="max-w-lg mx-auto text-center">
        <span className="inline-block px-3 py-1 bg-brand-neon/15 text-brand-neon text-xs font-bold uppercase tracking-widest rounded mb-4">Don&apos;t miss out</span>
        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">LOVE PICKLEBALL?</h3>
        <p className="text-white/60 text-sm md:text-base mb-6 leading-relaxed">
          Get Dink Authority Magazine updates, new editions, pro stories and event alerts.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Your email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-brand-neon/50 transition-colors text-sm"
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-brand-neon/50 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 bg-brand-neon text-brand-purple font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
          {status === 'error' && <p className="text-red-400 text-xs mt-1">{message}</p>}
        </form>
        <p className="text-white/30 text-xs mt-4">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
