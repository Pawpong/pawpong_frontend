import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone', // Vercel optimized build
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 모든 HTTPS 도메인 허용
      },
      {
        protocol: "http",
        hostname: "**", // (옵션) HTTP 도메인도 허용
      },
    ],
  },
  // 정적 생성 중 에러 페이지 건너뛰기 (개발 중에만 사용)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
