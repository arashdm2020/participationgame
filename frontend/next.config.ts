import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arbiscan.io',
      },
      {
        protocol: 'https',
        hostname: 'sepolia.arbiscan.io',
      },
    ],
  },
  
  // Webpack configuration for Web3
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  
  // External packages that should not be bundled
  serverExternalPackages: ['thread-stream', 'pino'],
};

export default withNextIntl(nextConfig);
