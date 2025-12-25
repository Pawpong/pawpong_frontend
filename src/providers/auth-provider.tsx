'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { VerificationStatus } from '@/stores/auth-store';
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
          const rawStatus = profile.verificationInfo?.status;
          // auth-store는 reviewing 상태를 따로 관리하지 않아 pending으로 매핑
          const verificationStatus: VerificationStatus =
            rawStatus === 'approved' || rawStatus === 'rejected' ? rawStatus : 'pending';
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
            email: profile.emailAddress,
            name: profile.nickname,
            role: 'adopter',
          });
        }
      } catch (error) {
        // 탈퇴한 계정 에러는 무시 (각 페이지에서 개별 처리)
        const errorMessage = error instanceof Error ? error.message : '';
        console.log('[AuthProvider] 프로필 조회 실패:', errorMessage);

        if (errorMessage.includes('탈퇴')) {
          console.log('[AuthProvider] 탈퇴 계정 감지 - 페이지에서 처리하도록 에러 무시');
          // 여기서 로그아웃하지 않고, 각 페이지에서 모달을 띄운 후 로그아웃하도록 함
        }
      }
    };

    initAuth();
  }, [hasHydrated, setUser, user?.userId, user?.role, user?.verificationStatus]);

  return <>{children}</>;
}
