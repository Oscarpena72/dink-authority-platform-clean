export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';
import PWARegister from './_components/pwa-register';
import PWAInstallPrompt from './_components/pwa-install-prompt';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'Dink Authority Magazine | The Voice of Pickleball',
  description: 'Your premier source for professional pickleball news, player profiles, tournament coverage, pickleball places, and the global pickleball community.',
  keywords: 'pickleball, magazine, news, tournaments, pro players, pickleball places, courts, clubs, pickleball community',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Dink Authority Magazine | The Voice of Pickleball',
    description: 'Your premier source for professional pickleball news, player profiles, tournament coverage, pickleball places, and the global pickleball community.',
    images: ['/og-image.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#090426" />
        <meta name="robots" content="max-image-preview:large" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dink Authority" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dink Authority Magazine',
              url: 'https://dinkauthoritymagazine.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://dinkauthoritymagazine.com/icon-512x512.png',
                width: 512,
                height: 512,
              },
              sameAs: [],
              description: 'Your premier source for professional pickleball news, player profiles, tournament coverage, pickleball places, and the global pickleball community.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Dink Authority Magazine',
              url: 'https://dinkauthoritymagazine.com',
              publisher: {
                '@type': 'Organization',
                name: 'Dink Authority Magazine',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://dinkauthoritymagazine.com/articles?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="font-body bg-white text-brand-purple antialiased selection:bg-brand-neon/20 selection:text-brand-purple">
        <Providers>{children}</Providers>
        <PWARegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
