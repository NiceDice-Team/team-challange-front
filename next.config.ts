import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "react-country-region-selector",
    "react-phone-number-input",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.bgshop.work.gd',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
