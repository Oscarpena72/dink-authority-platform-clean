"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Users, Globe, Award } from 'lucide-react';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import WhatsAppButton from '@/app/_components/whatsapp-button';

const VALUES = [
  { icon: Target, title: 'Precision Coverage', desc: 'In-depth reporting on every major tournament, player movement, and industry development.' },
  { icon: Users, title: 'Community First', desc: 'Built by pickleball enthusiasts for pickleball enthusiasts. We are the voice of the community.' },
  { icon: Globe, title: 'Global Reach', desc: 'Covering pickleball across North America, Latin America, Europe, and beyond.' },
  { icon: Award, title: 'Editorial Excellence', desc: 'Professional journalism standards with passion for the fastest-growing sport in the world.' },
];

export default function AboutPageClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-brand-purple py-16">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">About Dink Authority</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                The premier digital magazine dedicated to the global pickleball community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-brand-purple mb-6">Our Mission</h2>
              <div className="text-brand-purple/70 space-y-4 text-lg leading-relaxed">
                <p>
                  Dink Authority Magazine was born from a simple belief: pickleball deserves world-class sports journalism. As the fastest-growing sport in the world, pickleball has evolved from backyard recreation to a professional spectacle — and its media coverage should match.
                </p>
                <p>
                  We deliver comprehensive coverage of professional pickleball, from PPA and MLP tournaments to grassroots community events. Our editorial team brings decades of combined sports journalism experience, covering every dink, drive, and erne with the same rigor you'd expect from any major sports publication.
                </p>
                <p>
                  Whether you are a seasoned professional or just picking up a paddle for the first time, Dink Authority Magazine is your home for everything pickleball.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-brand-gray">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-brand-purple text-center mb-10">What Drives Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v: any, i: number) => (
                <motion.div
                  key={v?.title ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <v.icon size={32} className="text-brand-neon mb-4" />
                  <h3 className="font-heading font-bold text-brand-purple mb-2">{v?.title}</h3>
                  <p className="text-sm text-brand-gray-dark">{v?.desc}</p>
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
