"use client";
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Facebook, Linkedin, Mail, Copy, Check, X as XIcon, Instagram,
  Newspaper, Globe, Megaphone, Award, Users, ArrowRight, CheckCircle, Loader2
} from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';

const BENEFIT_ICONS = [Newspaper, Globe, Megaphone, Award, Users];

function ShareButtons() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  const url = mounted ? window.location.href : '';
  const title = 'Become a Dink Authority Community Correspondent';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const copyLink = useCallback(async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, [url]);
  const socials = [
    { name: 'WhatsApp', icon: () => <span className="text-lg">💬</span>, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:bg-[#25D366] hover:text-white' },
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:bg-[#1877F2] hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:bg-[#0A66C2] hover:text-white' },
    { name: 'X', icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:bg-black hover:text-white' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white', onClick: copyLink },
  ];
  return (
    <div className="relative">
      <button onClick={() => setShowShare(!showShare)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold hover:bg-brand-purple hover:text-white transition-all">
        <Share2 size={16} /> {t('community.shareTitle')}
      </button>
      <AnimatePresence>
        {showShare && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-30 min-w-[240px]">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('community.shareTitle')}</p>
            <div className="grid grid-cols-3 gap-2">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target={s.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer"
                  onClick={(e) => { if (s.onClick) { e.preventDefault(); s.onClick(); } }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 transition-all ${s.color}`}>
                  {typeof s.icon === 'function' ? <s.icon size={18} /> : null}
                  <span className="text-[10px] font-medium">{s.name}</span>
                </a>
              ))}
            </div>
            <button onClick={copyLink} className="flex items-center gap-2 w-full mt-3 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? t('community.copied') : t('community.copyLink')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CommunityPageClient() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: '', lastName: '', city: '', state: '', address: '', zipCode: '', phone: '', email: '',
    facebookUrl: '', instagramUrl: '', tiktokUrl: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const benefits = [
    t('community.benefit1'), t('community.benefit2'), t('community.benefit3'),
    t('community.benefit4'), t('community.benefit5'),
  ];

  const editorialParagraphs = [
    t('community.editorialP1'), t('community.editorialP2'), t('community.editorialP3'),
    t('community.editorialP4'), t('community.editorialP5'), t('community.editorialP6'),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/7] max-h-[65vh] overflow-hidden">
            <Image src="/images/community-hero.jpg" alt="Dink Authority Community Correspondents" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-6 md:py-12">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block px-4 py-1.5 bg-brand-neon text-brand-purple text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  ⭐ Community Network
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black text-white mb-3 leading-tight">
                  {t('community.heroTitle')}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-2">{t('community.heroSubtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-2 text-white/70 text-sm md:text-base italic">
                  <span>{t('community.tagline1')}</span>
                  <span className="hidden sm:inline text-brand-neon">·</span>
                  <span>{t('community.tagline2')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Share + Editorial */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-end mb-8">
            <ShareButtons />
          </div>

          {/* Editorial Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-purple">
            {editorialParagraphs.map((p, i) => (
              <p key={i} className={`text-gray-700 leading-relaxed ${
                i === 0 ? 'text-xl md:text-2xl font-heading font-bold text-brand-purple' :
                i === editorialParagraphs.length - 1 ? 'text-lg font-semibold text-brand-purple' : ''
              }`}>
                {p}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Benefits */}
        <section className="bg-gradient-to-br from-brand-purple to-brand-purple-dark py-16">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl md:text-3xl font-heading font-bold text-white text-center mb-10">
              {t('community.benefitsTitle')}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i] || Award;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-brand-neon/20 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-brand-neon" />
                    </div>
                    <p className="text-white font-medium leading-relaxed">{benefit}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16 bg-brand-gray" id="register">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-purple text-center mb-2">
                {t('community.formTitle')}
              </h2>
              <div className="w-16 h-1 bg-brand-neon mx-auto mb-10 rounded-full" />

              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-brand-neon/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-brand-neon" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-brand-purple mb-3">{t('community.successTitle')}</h3>
                  <p className="text-gray-600 max-w-md mx-auto">{t('community.successText')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label={t('community.firstName')} name="firstName" value={form.firstName} onChange={handleChange} required />
                    <FormField label={t('community.lastName')} name="lastName" value={form.lastName} onChange={handleChange} required />
                    <FormField label={t('community.city')} name="city" value={form.city} onChange={handleChange} required />
                    <FormField label={t('community.state')} name="state" value={form.state} onChange={handleChange} required />
                    <FormField label={t('community.address')} name="address" value={form.address} onChange={handleChange} />
                    <FormField label={t('community.zipCode')} name="zipCode" value={form.zipCode} onChange={handleChange} />
                    <FormField label={t('community.phone')} name="phone" value={form.phone} onChange={handleChange} type="tel" />
                    <FormField label={t('community.email')} name="email" value={form.email} onChange={handleChange} type="email" required />
                  </div>

                  {/* Social Media */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-bold text-brand-purple uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Globe size={16} className="text-brand-neon" /> Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <FormField label={t('community.facebook')} name="facebookUrl" value={form.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
                      <FormField label={t('community.instagram')} name="instagramUrl" value={form.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
                      <FormField label={t('community.tiktok')} name="tiktokUrl" value={form.tiktokUrl} onChange={handleChange} placeholder="https://tiktok.com/@..." />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="border-t border-gray-100 pt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('community.messageLabel')}</label>
                    <p className="text-xs text-gray-500 mb-3">{t('community.messageHint')}</p>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                      className="w-full px-4 py-3 bg-brand-gray border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon outline-none transition-all resize-none" />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}

                  <div className="pt-4">
                    <button type="submit" disabled={status === 'loading'}
                      className="w-full py-4 bg-brand-neon text-brand-purple-dark font-bold text-lg rounded-xl hover:bg-brand-neon-dim transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                      {status === 'loading' ? (
                        <><Loader2 size={20} className="animate-spin" /> {t('community.submitting')}</>
                      ) : (
                        <><ArrowRight size={20} /> {t('community.submit')}</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FormField({ label, name, value, onChange, required, type = 'text', placeholder }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder || ''}
        className="w-full px-4 py-3 bg-brand-gray border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon outline-none transition-all" />
    </div>
  );
}
