'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAnalytics } from '@/hooks/use-analytics';

/**
 * 소셜 로그인 성공 후 토큰을 쿠키에 저장하는 페이지
 *
 * 백엔드 OAuth 콜백에서 토큰을 URL 파라미터로 전달받아
 * 프론트엔드 API 라우트(/api/auth/set-cookie)를 통해 HttpOnly 쿠키에 저장
 *
 * Client Component로 구현해야 하는 이유:
 * - Next.js 15에서 Server Component에서는 쿠키 수정 불가
 * - 브라우저에서 직접 fetch해야 Set-Cookie 헤더가 적용됨
 */
function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const { trackLogin, setUserId } = useAnalytics();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processLogin = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (!accessToken || !refreshToken) {
        console.error('토큰이 없습니다. 로그인 페이지로 이동합니다.');
        router.replace('/login');
        return;
      }

      try {
        // 프론트엔드 API 라우트를 통해 쿠키 설정
        const res = await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, refreshToken }),
          credentials: 'include',
        });

        if (res.ok) {
          // JWT에서 사용자 정보 추출하여 상태 설정
          let userRole: 'adopter' | 'breeder' = 'adopter';
          let userId = '';
          const loginMethod = 'oauth'; // OAuth 소셜 로그인

          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            userId = payload.sub || '';
            userRole = payload.role || 'adopter';

            setUser({
              userId,
              email: payload.email || '',
              name: payload.name || '',
              role: userRole,
            });

            // GA4 로그인 이벤트 트래킹
            trackLogin(loginMethod, userRole);
            // GA4 사용자 ID 설정
            setUserId(userId);
          } catch {
            // JWT 파싱 실패해도 로그인 진행
          }

          // 로그인 성공 - returnUrl이 있으면 그곳으로, 없으면 홈으로 이동
          const returnUrl = searchParams.get('returnUrl') || '/';
          console.log('[Login Success] returnUrl:', returnUrl, 'searchParams:', Array.from(searchParams.entries()));
          router.replace(returnUrl);
        } else {
          console.error('쿠키 설정 실패');
          setError('로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => router.replace('/login'), 2000);
        }
      } catch (err) {
        console.error('로그인 처리 중 오류:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.replace('/login'), 2000);
      }
    };

    processLogin();
  }, [searchParams, router, setUser, trackLogin, setUserId]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="mt-2 text-gray-500">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <LoginSuccessContent />
    </Suspense>
  );
}
