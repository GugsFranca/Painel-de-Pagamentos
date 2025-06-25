import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/charts/:path*',
        destination: 'http://backend:8090/charts/:path*' // proxy interno Docker
      },
      {
        source: '/row-data/:path*',
        destination: 'http://backend:8090/row-data/:path*' // novo proxy para /api
      }
    ];
  }
};

export default nextConfig;
