"use client";
import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

export default function MagazineRedirectClient({ url, title }: Props) {
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    // Show manual link after a short delay as fallback
    const timer = setTimeout(() => setShowManual(true), 1500);

    // Use window.location for maximum mobile compatibility
    try {
      window.location.href = url;
    } catch {
      setShowManual(true);
    }

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="min-h-screen bg-brand-purple flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-brand-neon/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen size={32} className="text-brand-neon" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white mb-3">{title}</h1>
        <p className="text-white/60 text-sm mb-6">Opening your digital edition…</p>

        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 border-3 border-brand-neon/30 border-t-brand-neon rounded-full animate-spin" />
        </div>

        {/* Fallback link — always visible but styled subtly at first */}
        <a
          href={url}
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-purple-dark font-bold rounded-lg hover:bg-brand-neon-dim transition-all text-sm uppercase tracking-wider ${
            showManual ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Tap here to read <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
