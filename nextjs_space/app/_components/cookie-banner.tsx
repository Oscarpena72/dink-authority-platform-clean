"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Megaphone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

function generateSessionId(): string {
  return 'cs_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage?.getItem?.('cookie_preferences');
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const saveConsent = useCallback(async (prefs: CookiePreferences) => {
    // Save locally
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
    localStorage.setItem('cookies_accepted', 'true'); // backward compat

    // Get or create session ID
    let sessionId = localStorage.getItem('cookie_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('cookie_session_id', sessionId);
    }

    // Record to DB (fire and forget)
    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          analytics: prefs.analytics,
          marketing: prefs.marketing,
        }),
      });
    } catch {
      // silent — don't block UX
    }

    setVisible(false);
  }, []);

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, marketing: true };
    setPreferences(all);
    saveConsent(all);
  };

  const handleRejectOptional = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-purple/95 backdrop-blur-md border-t border-brand-neon/20 shadow-2xl">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie size={22} className="text-brand-neon flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-semibold mb-1">
                {t('cookie.title')}
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                {t('cookie.message')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 border border-white/20 text-white/80 text-xs font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {t('cookie.customize')}
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              onClick={handleRejectOptional}
              className="px-4 py-2 border border-white/20 text-white/80 text-xs font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors"
            >
              {t('cookie.rejectOptional')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2 bg-brand-neon text-brand-purple-dark font-bold text-xs rounded-lg hover:bg-brand-neon-dim transition-colors"
            >
              {t('cookie.acceptAll')}
            </button>
          </div>
        </div>

        {/* Expandable details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            {/* Essential */}
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-brand-neon" />
                <div>
                  <p className="text-white text-sm font-medium">{t('cookie.essential')}</p>
                  <p className="text-white/50 text-xs">{t('cookie.essentialDesc')}</p>
                </div>
              </div>
              <span className="text-brand-neon text-xs font-semibold uppercase tracking-wide">{t('cookie.alwaysActive')}</span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <BarChart3 size={16} className="text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">{t('cookie.analytics')}</p>
                  <p className="text-white/50 text-xs">{t('cookie.analyticsDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  preferences.analytics ? 'bg-brand-neon' : 'bg-white/20'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.analytics ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <Megaphone size={16} className="text-orange-400" />
                <div>
                  <p className="text-white text-sm font-medium">{t('cookie.marketing')}</p>
                  <p className="text-white/50 text-xs">{t('cookie.marketingDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  preferences.marketing ? 'bg-brand-neon' : 'bg-white/20'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.marketing ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 bg-brand-neon text-brand-purple-dark font-bold text-xs rounded-lg hover:bg-brand-neon-dim transition-colors"
              >
                {t('cookie.savePreferences')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
