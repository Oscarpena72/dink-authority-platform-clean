"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Globe, Award } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';
import { useLanguage } from '@/lib/i18n/language-context';
import type { TranslationKey } from '@/lib/i18n/translations';

const VALUE_ICONS = [Target, Users, Globe, Award];

const DEFAULT_VALUES: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'about.precisionCoverage', descKey: 'about.precisionCoverageDesc' },
  { titleKey: 'about.communityFirst', descKey: 'about.communityFirstDesc' },
  { titleKey: 'about.globalReach', descKey: 'about.globalReachDesc' },
  { titleKey: 'about.editorialExcellence', descKey: 'about.editorialExcellenceDesc' },
];

export default function AboutPageClient() {
  const { t } = useLanguage();

  /* CMS overrides from SiteSettings */
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionP1, setMissionP1] = useState('');
  const [missionP2, setMissionP2] = useState('');
  const [missionP3, setMissionP3] = useState('');
  const [valuesTitle, setValuesTitle] = useState('');
  const [values, setValues] = useState<{ title: string; desc: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((s: Record<string, string>) => {
        if (s.about_hero_title) setHeroTitle(s.about_hero_title);
        if (s.about_hero_subtitle) setHeroSubtitle(s.about_hero_subtitle);
        if (s.about_mission_title) setMissionTitle(s.about_mission_title);
        if (s.about_mission_p1) setMissionP1(s.about_mission_p1);
        if (s.about_mission_p2) setMissionP2(s.about_mission_p2);
        if (s.about_mission_p3) setMissionP3(s.about_mission_p3);
        if (s.about_values_title) setValuesTitle(s.about_values_title);
        const v: { title: string; desc: string }[] = [];
        if (s.about_value1_title || s.about_value1_desc) v.push({ title: s.about_value1_title || '', desc: s.about_value1_desc || '' });
        if (s.about_value2_title || s.about_value2_desc) v.push({ title: s.about_value2_title || '', desc: s.about_value2_desc || '' });
        if (s.about_value3_title || s.about_value3_desc) v.push({ title: s.about_value3_title || '', desc: s.about_value3_desc || '' });
        if (s.about_value4_title || s.about_value4_desc) v.push({ title: s.about_value4_title || '', desc: s.about_value4_desc || '' });
        if (v.length > 0) setValues(v);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  /* Use CMS content if available, otherwise i18n defaults */
  const displayHeroTitle = heroTitle || t('about.title');
  const displayHeroSubtitle = heroSubtitle || t('about.subtitle');
  const displayMissionTitle = missionTitle || t('about.mission');
  const displayMissionP1 = missionP1 || t('about.missionP1');
  const displayMissionP2 = missionP2 || t('about.missionP2');
  const displayMissionP3 = missionP3 || t('about.missionP3');
  const displayValuesTitle = valuesTitle || t('about.whatDrivesUs');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-brand-purple py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{displayHeroTitle}</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">{displayHeroSubtitle}</p>
            </motion.div>
          </div>
        </div>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-brand-purple mb-6">{displayMissionTitle}</h2>
              <div className="text-brand-purple/70 space-y-4 text-lg leading-relaxed">
                {displayMissionP1 && <p>{displayMissionP1}</p>}
                {displayMissionP2 && <p>{displayMissionP2}</p>}
                {displayMissionP3 && <p>{displayMissionP3}</p>}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-brand-gray">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-brand-purple text-center mb-10">{displayValuesTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(values.length > 0 ? values : DEFAULT_VALUES.map((v, i) => ({
                title: t(v.titleKey),
                desc: t(v.descKey),
              }))).map((v, i) => {
                const Icon = VALUE_ICONS[i] || Target;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all"
                  >
                    <Icon size={32} className="text-brand-neon mb-4" />
                    <h3 className="font-heading font-bold text-brand-purple mb-2">{v.title}</h3>
                    <p className="text-sm text-brand-gray-dark">{v.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton phoneNumber={null} />
    </div>
  );
}
