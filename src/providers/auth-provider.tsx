'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getAdopterProfile } from '@/lib/adopter';
import { getMyBreederProfile } from '@/lib/breeder';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, hasHydrated, user } = useAuthStore();

  // useLayoutEffect로 cookie에서 role을 먼저 읽어 빠르게 적용
  useLayoutEffect(() => {
    if (!hasHydrated) return;
    if (user) return;

    const cookieRole = getUserRoleFromCookie();
    if (cookieRole && !user) {
      // cookie role이 있으면 임시로 user 설정 (프로필 조회 전)
      setUser({
        userId: '',
        email: '',
        name: '',
        role: cookieRole,
      });
    }
  }, [hasHydrated, user, setUser]);

  // 이후 프로필 조회로 전체 정보 업데이트
  useEffect(() => {
    if (!hasHydrated) return;

    const initAuth = async () => {
      try {
        const cookieRole = getUserRoleFromCookie();

        if (!cookieRole) {
          return;
        }

        if (cookieRole === 'breeder') {
          const profile = await getMyBreederProfile();
          // API 응답에서 verificationInfo는 breeder.verification 객체를 직접 반환
          // 따라서 verificationInfo.status로 접근해야 함
          const verificationStatus =
            (profile.verificationInfo as any)?.status ||
            profile.verificationInfo?.verificationStatus ||
            'pending';
          setUser({
            userId: profile.breederId,
            email: profile.breederEmail,
            name: profile.breederName,
            role: 'breeder',
            verificationStatus,
          });
        } else {
          const profile = await getAdopterProfile();
          setUser({
            userId: profile.adopterId,
            email: profile.email,
            name: profile.name || profile.nickname,
            role: 'adopter',
          });
        }
      } catch {
        // 프로필 조회 실패 시 무시
      }
    };

    initAuth();
  }, [hasHydrated, setUser]);

  return <>{children}</>;
}
