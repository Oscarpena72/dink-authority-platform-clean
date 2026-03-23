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
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">DINK AUTHORITY<span className="text-brand-neon">.</span></h3>
            <p className="text-brand-neon text-xs font-bold uppercase tracking-widest mb-3">Magazine</p>
            <p className="text-white/60 text-sm leading-relaxed">
              The premier digital magazine for the global pickleball community. Covering pro players, tournaments, gear, and everything pickleball.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-bold text-brand-neon mb-4 uppercase text-sm tracking-wider">Navigation</h3>
            <div className="flex flex-col gap-2">
              {FOOTER_NAV.map((item: any) => (
                <Link key={item?.label} href={item?.href ?? '#'} className="text-white/70 hover:text-brand-neon transition-colors text-sm">
                  {item?.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading font-bold text-brand-neon mb-4 uppercase text-sm tracking-wider">Connect</h3>
            <div className="flex items-center gap-3 mb-4">
              {SOCIALS.map((s: any) => (
                <a key={s?.label} href={s?.href ?? '#'} aria-label={s?.label} className="p-2 bg-white/10 rounded-lg hover:bg-brand-neon/20 hover:text-brand-neon transition-all">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Mail size={14} />
              <span>info@dinkauthoritymagazine.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Dink Authority Magazine. All rights reserved.</p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
