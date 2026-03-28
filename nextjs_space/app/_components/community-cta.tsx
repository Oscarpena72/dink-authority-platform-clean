"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/language-context';
import { ArrowRight } from 'lucide-react';

export default function CommunityCta() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="col-span-1 md:col-span-2 lg:col-span-3"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple via-brand-purple-dark to-brand-purple">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-neon rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-neon rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        </div>
        <div className="relative px-6 md:px-12 py-10 md:py-14 text-center">
          <span className="inline-block px-4 py-1.5 bg-brand-neon/20 text-brand-neon text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            ⭐ Community Network
          </span>
          <h3 className="text-2xl md:text-4xl font-heading font-black text-white mb-4">
            {t('community.ctaTitle')}
          </h3>
          <div className="max-w-lg mx-auto mb-6 space-y-1">
            <p className="text-white/80 text-base md:text-lg">{t('community.ctaSubtitle1')}</p>
            <p className="text-white/80 text-base md:text-lg">{t('community.ctaSubtitle2')}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <p className="text-brand-neon/80 text-sm italic">{t('community.ctaLine1')}</p>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-neon/50" />
            <p className="text-brand-neon/80 text-sm italic">{t('community.ctaLine2')}</p>
          </div>
          <Link href="/community"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-neon text-brand-purple-dark font-bold text-sm uppercase tracking-widest rounded-full hover:bg-brand-neon-dim transition-all shadow-lg shadow-brand-neon/20">
            {t('community.ctaButton')} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
