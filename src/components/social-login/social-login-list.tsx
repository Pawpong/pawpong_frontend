'use client';

import Google from '@/assets/logo/google';
import Kakao from '@/assets/logo/kakao';
import Naver from '@/assets/logo/naver';
import SocialLoginButton from './social-login-button';
import SocialLoginIcon from './social-login-icon';
import { useRouter, useSearchParams } from 'next/navigation';

// trailing slash 제거하여 이중 슬래시 방지
const getApiBaseUrl = () => {
  // 1순위: 환경 변수
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, '');
  }

  // 2순위: 브라우저 환경에서 자동 감지
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Vercel 개발 배포
    if (hostname.includes('pawpongdev.vercel.app')) {
      return 'https://dev-api.pawpong.kr';
    }

    // 프로덕션
    if (hostname.includes('pawpong.kr')) {
      return 'https://api.pawpong.kr';
    }

    // localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
  }

  // 3순위: 기본값
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

export default function SocialLoginList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '';

  // 이미 로그인되어 있는지 확인
  // 쿠키가 있으면 returnUrl이 있으면 그곳으로, 없으면 홈으로 이동
  const checkAlreadyLoggedIn = (): boolean => {
    // 쿠키에서 accessToken 확인
    const cookies = document.cookie.split(';');
    const hasAccessToken = cookies.some((cookie) => cookie.trim().startsWith('accessToken='));

    if (hasAccessToken) {
      // returnUrl이 있으면 그곳으로, 없으면 홈으로 이동
      const redirectUrl = returnUrl || '/';
      router.push(redirectUrl);
      return true;
    }

    return false;
  };

  const socialLoginInfo = [
    {
      name: '카카오로 시작하기',
      icon: Kakao,
      className: 'bg-[#FEE500] text-grayscale-black! hover:bg-[#FEE500]/80',
      onClick: () => {
        if (checkAlreadyLoggedIn()) return;
        const url = returnUrl
          ? `${API_BASE_URL}/api/auth/kakao?returnUrl=${encodeURIComponent(returnUrl)}`
          : `${API_BASE_URL}/api/auth/kakao`;
        window.location.href = url;
      },
    },
    {
      name: '네이버로 시작하기',
      icon: Naver,
      className: 'bg-[#03C75A] text-grayscale-white! hover:bg-[#03C75A]/80',
      onClick: () => {
        if (checkAlreadyLoggedIn()) return;
        const url = returnUrl
          ? `${API_BASE_URL}/api/auth/naver?returnUrl=${encodeURIComponent(returnUrl)}`
          : `${API_BASE_URL}/api/auth/naver`;
        window.location.href = url;
      },
    },
    {
      name: '구글로 시작하기',
      icon: Google,
      className: 'bg-tertiary-500 text-grayscale-black! hover:bg-tertiary-500/80',
      onClick: () => {
        if (checkAlreadyLoggedIn()) return;
        const url = returnUrl
          ? `${API_BASE_URL}/api/auth/google?returnUrl=${encodeURIComponent(returnUrl)}`
          : `${API_BASE_URL}/api/auth/google`;
        window.location.href = url;
      },
    },
  ];
  return (
    <div className="space-y-3 w-full">
      {socialLoginInfo.map(({ name, icon: Icon, className, onClick }) => (
        <SocialLoginButton key={name} className={className} onClick={onClick}>
          <SocialLoginIcon className="size-4">
            <Icon />
          </SocialLoginIcon>

          {name}
        </SocialLoginButton>
      ))}
    </div>
  );
}
