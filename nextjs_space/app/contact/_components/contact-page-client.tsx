"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, MapPin } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: any) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [e?.target?.name ?? '']: e?.target?.value ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data?.error ?? 'Failed to send message');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-purple py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Get In Touch</h1>
            <p className="text-white/70 text-lg">Have a story tip, partnership inquiry, or just want to say hello?</p>
          </div>
        </div>

        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-brand-neon mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-brand-purple mb-1">Email</h3>
                  <p className="text-sm text-brand-gray-dark">info@dinkauthoritymagazine.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-neon mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-brand-purple mb-1">Location</h3>
                  <p className="text-sm text-brand-gray-dark">Miami, FL</p>
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <CheckCircle size={48} className="text-brand-neon mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-brand-purple mb-2">Message Sent!</h2>
                <p className="text-brand-gray-dark">Thank you for reaching out. We will get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-purple mb-2">Name</label>
                    <input name="name" value={form?.name ?? ''} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-brand-gray focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-purple mb-2">Email</label>
                    <input name="email" type="email" value={form?.email ?? ''} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-brand-gray focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Your email" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-purple mb-2">Subject</label>
                  <input name="subject" value={form?.subject ?? ''} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-brand-gray focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none" placeholder="Subject" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-purple mb-2">Message</label>
                  <textarea name="message" value={form?.message ?? ''} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-lg border border-brand-gray focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none resize-none" placeholder="Your message..." />
                </div>
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}
                <button type="submit" disabled={status === 'loading'} className="w-full md:w-auto px-8 py-3 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send size={16} /> {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-xs text-brand-gray-dark">Your information is stored securely and will only be used to respond to your inquiry.</p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}
