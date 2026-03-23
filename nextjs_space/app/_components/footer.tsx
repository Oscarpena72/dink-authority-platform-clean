"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'News', href: '/articles?category=news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Events', href: '/articles?category=events' },
];

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-purple-dark text-white">
      {/* Blue accent line at top */}
      <div className="h-1 blue-gradient" />
      <div className="max-w-[1400px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-1">DINK AUTHORITY<span className="text-brand-blue">.</span></h3>
            <p className="text-brand-neon text-xs font-bold uppercase tracking-[0.2em] mb-4">Magazine</p>
            <p className="text-white/50 text-sm leading-relaxed">
              The premier digital magazine for the global pickleball community. Covering pro players, tournaments, gear, and everything pickleball.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-bold text-white mb-5 uppercase text-sm tracking-wider">Navigation</h3>
            <div className="flex flex-col gap-3">
              {FOOTER_NAV.map((item: any) => (
                <Link key={item?.label} href={item?.href ?? '#'} className="text-white/50 hover:text-brand-neon transition-colors text-sm font-medium">
                  {item?.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading font-bold text-white mb-5 uppercase text-sm tracking-wider">Connect</h3>
            <div className="flex items-center gap-3 mb-5">
              {SOCIALS.map((s: any) => (
                <a key={s?.label} href={s?.href ?? '#'} aria-label={s?.label} className="p-2.5 bg-white/5 rounded-xl hover:bg-brand-blue/20 hover:text-brand-neon transition-all border border-white/5 hover:border-brand-blue/30">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Mail size={14} className="text-brand-blue" />
              <span>info@dinkauthoritymagazine.com</span>
            </div>
          </div>
        </div>

        {/* Sponsors bar */}
        <div className="border-t border-white/5 mt-10 pt-8">
          <p className="text-white/30 text-[10px] uppercase tracking-widest text-center mb-4 font-medium">Our Sponsors & Partners</p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-40 hover:opacity-60 transition-opacity">
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">JOOLA</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">SELKIRK</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">FRANKLIN</span>
            <span className="text-white/60 text-sm font-heading font-bold tracking-wider">ENGAGE</span>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Dink Authority Magazine. All rights reserved.</p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
