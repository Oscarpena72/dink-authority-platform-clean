"use client";
import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SW registered, scope:', reg.scope);
        })
        .catch((err) => {
          console.log('SW registration failed:', err);
        });
    }
  }, []);

  return null;
}
