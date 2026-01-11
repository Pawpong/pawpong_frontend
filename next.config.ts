import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone', // Vercel optimized build
  compiler: {
    // 프로덕션 환경에서만 console 제거
    // NODE_ENV가 'production'이거나, API_BASE_URL에 'dev-api'가 없으면 프로덕션으로 간주
    removeConsole: (() => {
      const isProduction = process.env.NODE_ENV === 'production';
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const isProductionApi = apiUrl ? !apiUrl.includes('dev-api') : false;
      return isProduction || isProductionApi;
    })(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 도메인 허용
      },
      {
        protocol: 'http',
        hostname: '**', // (옵션) HTTP 도메인도 허용
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
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
