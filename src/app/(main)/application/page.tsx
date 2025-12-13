'use client';

import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ApplicationListItem from './_components/application-list-item';
import DownArrow from '@/assets/icons/long-down-arrow.svg';
import { useApplications } from './_hooks/use-applications';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';
import { useState, useEffect } from 'react';

const ApplicationPage = () => {
  const { isLoading: isAuthLoading } = useAuthGuard();
  const { user } = useAuthStore();
  const [isBreeder, setIsBreeder] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 후에만 role 결정 (Hydration 에러 방지)
  useEffect(() => {
    const cookieRole = getUserRoleFromCookie();
    const userRole = cookieRole || user?.role;
    setIsBreeder(userRole === 'breeder');
    setIsMounted(true);
  }, [user?.role]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useApplications();
  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];
  const isMdUp = useBreakpoint('md');

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 페이지 제목을 role에 따라 다르게 표시
  const pageTitle = isBreeder ? '받은 신청' : '신청 내역';
  const emptyMessage = isBreeder ? '받은 신청이 없습니다.' : '신청 내역이 없습니다.';

  if (isAuthLoading || isLoading || !isMounted) {
    return (
      <Container>
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">신청 내역</div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">{pageTitle}</div>

        {allApplications.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-7">
              {allApplications.map((item, index) => (
                <div key={item.applicationId} className="flex flex-col">
                  <ApplicationListItem {...item} isBreeder={isBreeder} />
                  {(isMdUp ? index !== allApplications.length - 1 : true) && <Separator className="mt-7" />}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="flex justify-center pb-20 lg:pb-24">
                <Button
                  variant="ghost"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="bg-[var(--color-grayscale-gray1)] hover:bg-[var(--color-grayscale-gray2)] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50"
                >
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    {isFetchingNextPage ? '로딩 중...' : '더보기'}
                  </span>
                  <DownArrow />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default ApplicationPage;
