// Description: This is a Next.js configuration file that sets up an alias for the 'src' directory.
// It allows you to import modules from the 'src' directory using '@' as a prefix, making the imports cleaner and more manageable.

import path from "node:path";
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
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");

    return config;
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
