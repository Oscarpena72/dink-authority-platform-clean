"use client";
import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SW registered, scope:', reg.scope);
          // Force check for updates immediately
          reg.update().catch(() => {});
          // Check for updates periodically (every 60 seconds)
          setInterval(() => {
            reg.update().catch(() => {});
          }, 60000);
        })
        .catch((err) => {
          console.log('SW registration failed:', err);
        });
    }
  }, []);

  return null;
}
