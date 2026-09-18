"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

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

  // Track page views on EVERY navigation (initial hard load + client-side soft
  // navigations). In GA4, re-calling gtag('config', ID) on route change does NOT
  // reliably emit a new page_view, so pages reached only via client-side <Link>
  // navigation (e.g. /pickleball/shop, individual article pages) were never
  // recorded. We instead send an explicit 'page_view' event on each route change.
  useEffect(() => {
    if (!consentGiven || !GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    const sendPageView = () => {
      if (typeof window.gtag !== "function") return false;
      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
      return true;
    };

    // Fire immediately if gtag is ready; otherwise retry briefly to cover the
    // race where the gtag script has not finished loading on the first view.
    if (sendPageView()) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (sendPageView() || tries > 20) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
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
            // Load GA but do NOT auto-send the first page_view here; the React
            // effect above sends a 'page_view' event for every route (including
            // the initial one) so tracking is consistent across the whole app.
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
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
