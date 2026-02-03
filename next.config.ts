import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix NEXTAUTH_URL for Vercel deployment
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith('http')
        ? process.env.NEXTAUTH_URL
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
