import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-794ee102186349d0adf4c16162b84a71.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "down-vn.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "down-ws-vn.img.susercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.foody.vn",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
}

export default nextConfig
