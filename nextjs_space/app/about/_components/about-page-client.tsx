"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Users, Globe, Award } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import { useLanguage } from '@/lib/i18n/language-context';
import type { TranslationKey } from '@/lib/i18n/translations';

const VALUES: { icon: any; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Target, titleKey: 'about.precisionCoverage', descKey: 'about.precisionCoverageDesc' },
  { icon: Users, titleKey: 'about.communityFirst', descKey: 'about.communityFirstDesc' },
  { icon: Globe, titleKey: 'about.globalReach', descKey: 'about.globalReachDesc' },
  { icon: Award, titleKey: 'about.editorialExcellence', descKey: 'about.editorialExcellenceDesc' },
];

export default function AboutPageClient() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-brand-purple py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{t('about.title')}</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {t('about.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-brand-purple mb-6">{t('about.mission')}</h2>
              <div className="text-brand-purple/70 space-y-4 text-lg leading-relaxed">
                <p>{t('about.missionP1')}</p>
                <p>{t('about.missionP2')}</p>
                <p>{t('about.missionP3')}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-brand-gray">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-brand-purple text-center mb-10">{t('about.whatDrivesUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <v.icon size={32} className="text-brand-neon mb-4" />
                  <h3 className="font-heading font-bold text-brand-purple mb-2">{t(v.titleKey)}</h3>
                  <p className="text-sm text-brand-gray-dark">{t(v.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}