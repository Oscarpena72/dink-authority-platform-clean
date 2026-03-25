"use client";
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Don't show if user dismissed recently (24h)
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000) return;

    // Check iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show banner for iOS after 3 seconds
      const t = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[380px] z-[9999] animate-slide-up">
        <div className="bg-brand-purple border border-brand-neon/20 rounded-2xl shadow-2xl shadow-brand-purple/50 p-5 backdrop-blur-xl">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-neon/15 flex items-center justify-center">
              <Smartphone size={24} className="text-brand-neon" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-heading font-bold text-base mb-1">Install Dink Authority</h4>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                Add to your home screen for the best experience — fast access, offline reading.
              </p>
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-neon text-brand-purple font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
              >
                <Download size={16} />
                {isIOS ? 'How to Install' : 'Install App'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleDismiss}>
          <div className="bg-brand-purple border border-brand-neon/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleDismiss} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20} /></button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-neon/15 mb-4">
                <Smartphone size={28} className="text-brand-neon" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-1">Install on iOS</h3>
              <p className="text-white/50 text-sm">Follow these simple steps:</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-neon/15 text-brand-neon text-sm font-bold flex items-center justify-center">1</span>
                <p className="text-white/70 text-sm pt-0.5">Tap the <strong className="text-white">Share</strong> button <span className="inline-block text-brand-neon">⬆</span> at the bottom of Safari</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-neon/15 text-brand-neon text-sm font-bold flex items-center justify-center">2</span>
                <p className="text-white/70 text-sm pt-0.5">Scroll down and tap <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-neon/15 text-brand-neon text-sm font-bold flex items-center justify-center">3</span>
                <p className="text-white/70 text-sm pt-0.5">Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> to install the app</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full mt-6 py-3 bg-brand-neon text-brand-purple font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </>
  );
}
