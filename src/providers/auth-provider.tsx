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

    // 이미 완전한 user 정보가 있으면 조회하지 않음
    // userId가 있고, 브리더인 경우 verificationStatus도 있어야 완전한 상태
    const isCompleteUser =
      user?.userId && (user.role !== 'breeder' || user.verificationStatus !== undefined);
    if (isCompleteUser) return;

    const initAuth = async () => {
      try {
        const cookieRole = getUserRoleFromCookie();

        if (!cookieRole) {
          return;
        }

        if (cookieRole === 'breeder') {
          const profile = await getMyBreederProfile();
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
  }, [hasHydrated, setUser, user?.userId, user?.role, user?.verificationStatus]);

  return <>{children}</>;
}
