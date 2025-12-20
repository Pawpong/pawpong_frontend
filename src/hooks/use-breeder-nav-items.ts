'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyBreederProfile } from '@/lib/breeder';
import { NAV_ITEMS_BREEDER, type NavItem } from '@/components/gnb/nav-items';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';
import { useAuthStore } from '@/stores/auth-store';

/**
 * 브리더의 인증 상태에 따라 동적으로 네비게이션 아이템을 생성하는 훅
 *
 * pending 상태의 브리더는 '내 프로필' 메뉴에 접근할 수 없음
 * 승인된 브리더는 모든 메뉴 접근 가능
 */
export function useBreederNavItems(): { navItems: NavItem[]; isLoading: boolean } {
  const { user } = useAuthStore();
  const cookieRole = getUserRoleFromCookie();
  const userRole = cookieRole || user?.role;
  const isBreeder = userRole === 'breeder';

  // 브리더가 아닌 경우 기본 네비게이션 반환
  const { data: breederProfile, isLoading } = useQuery({
    queryKey: ['breeder-profile-nav'],
    queryFn: () => getMyBreederProfile(),
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
    enabled: isBreeder, // 브리더일 때만 쿼리 실행
  });

  // 로딩 중이거나 프로필이 없는 경우 기본 네비게이션 반환
  if (!isBreeder || isLoading || !breederProfile) {
    return {
      navItems: NAV_ITEMS_BREEDER,
      isLoading,
    };
  }

  // 인증 상태 확인
  const verificationStatus = breederProfile.verificationInfo?.verificationStatus;
  const isApproved = verificationStatus === 'approved';

  // 승인된 브리더는 모든 메뉴 활성화, pending 상태는 '내 프로필' 비활성화
  const dynamicNavItems: NavItem[] = NAV_ITEMS_BREEDER.map((item) => {
    if (item.name === '마이' && item.children) {
      return {
        ...item,
        children: item.children.map((child) => {
          // '내 프로필' 메뉴는 승인된 경우에만 활성화하고 브리더 상세페이지로 이동
          if (child.name === '내 프로필') {
            return {
              ...child,
              href: isApproved ? `/explore/breeder/${breederProfile.breederId}` : child.href,
              variant: isApproved ? 'default' : ('disabled' as const),
            };
          }
          return child;
        }),
      };
    }
    return item;
  });

  return {
    navItems: dynamicNavItems,
    isLoading: false,
  };
}
