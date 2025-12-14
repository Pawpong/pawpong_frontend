'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getAdopterProfile } from '@/lib/adopter';
import { getMyBreederProfile } from '@/lib/breeder';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';

interface UseAuthGuardOptions {
  redirectTo?: string;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/login' } = options;
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 이미 인증 확인이 완료된 경우
      if (isChecked) {
        setIsLoading(false);
        return;
      }

      try {
        // 서버에서 프로필 조회로 인증 상태 확인
        // 쿠키의 userRole을 우선적으로 사용 (localStorage보다 신뢰도 높음)
        const cookieRole = getUserRoleFromCookie();
        const currentUser = useAuthStore.getState().user;
        const userRole = cookieRole || currentUser?.role;

        if (userRole === 'breeder') {
          // 브리더 프로필 조회
          const profile = await getMyBreederProfile();
          setUser({
            userId: profile.breederId,
            email: profile.breederEmail,
            name: profile.breederName,
            role: 'breeder',
          });
        } else {
          // 입양자 프로필 조회 (기본값)
          const profile = await getAdopterProfile();
          setUser({
            userId: profile.adopterId,
            email: profile.emailAddress,
            name: profile.nickname,
            role: 'adopter',
          });
        }
        setIsChecked(true);
      } catch {
        // 인증 실패 시 로그인 페이지로 리다이렉트
        clearAuth();
        router.replace(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [redirectTo, router, setUser, clearAuth, isChecked]);

  return { user, isAuthenticated, isLoading };
}
