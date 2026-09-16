const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      // === Path-based section relocations under /pickleball (301) ===
      // NOTE: exact-path sources only — individual detail routes such as
      // /magazine/[slug], /news/[slug], /tips/[slug] and /shop/[slug] are NOT matched.
      // statusCode: 301 is used (instead of permanent: true, which emits 308)
      // because the spec requires classic 301 Moved Permanently responses.
      { source: '/magazine', destination: '/pickleball/magazine', statusCode: 301 }, // CHANGE 1
      {
        // CHANGE 2 — /news → /pickleball/news, but let the category variants
        // (results/events/places) fall through to middleware for clean sub-paths.
        source: '/news',
        missing: [
          { type: 'query', key: 'category', value: 'results' },
          { type: 'query', key: 'category', value: 'events' },
          { type: 'query', key: 'category', value: 'places' },
        ],
        destination: '/pickleball/news',
        statusCode: 301,
      },
      { source: '/tips', destination: '/pickleball/tips', statusCode: 301 },   // CHANGE 6
      { source: '/shop', destination: '/pickleball/shop', statusCode: 301 },   // CHANGE 10
      { source: '/es', destination: '/es/pickleball', statusCode: 301 },       // CHANGE 11
      { source: '/pt', destination: '/pt/pickleball', statusCode: 301 },       // CHANGE 12
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.filename = 'static/chunks/[name]-[contenthash:8].js';
      config.output.chunkFilename = 'static/chunks/[contenthash:16].js';
    }
    return config;
  },
};

module.exports = nextConfig;
