"use client";
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage?.getItem?.('cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage?.setItem?.('cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-purple-dark/95 backdrop-blur-md border-t border-white/10">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie size={20} className="text-brand-neon flex-shrink-0" />
          <p className="text-white/80 text-sm">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-brand-neon text-brand-purple font-bold text-sm rounded hover:bg-brand-neon-dim transition-colors"
          >
            Accept
          </button>
          <button onClick={handleAccept} className="p-2 text-white/50 hover:text-white transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
