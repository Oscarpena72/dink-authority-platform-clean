"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consentGiven, setConsentGiven] = useState(false);

  // Check cookie consent on mount and when it changes
  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem("cookie_preferences");
        if (stored) {
          const prefs = JSON.parse(stored);
          setConsentGiven(prefs.analytics === true);
        }
      } catch {
        // ignore parse errors
      }
    };

    checkConsent();

    // Re-check consent every 2 seconds in case user changes preferences
    const interval = setInterval(checkConsent, 2000);
    return () => clearInterval(interval);
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!consentGiven || !GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, consentGiven]);

  if (!GA_MEASUREMENT_ID || !consentGiven) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker />
    </Suspense>
  );
}
