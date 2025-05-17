/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: "https://bgshop.work.gd:8000/api/:path*" }];
  },
};

export default nextConfig;
