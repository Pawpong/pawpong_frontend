import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
