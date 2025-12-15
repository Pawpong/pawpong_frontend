'use client';

import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ApplicationListItem from './_components/application-list-item';
import DownArrow from '@/assets/icons/long-down-arrow.svg';
import { useApplications } from './_hooks/use-applications';
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
      <div className="flex-1 @container flex flex-col gap-3 pt-10 pb-20 px-12">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold">{pageTitle}</div>

        {allApplications.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {allApplications.map((item, index) => (
                <div key={item.applicationId || `application-${index}`}>
                  <div className="py-[28px]">
                    <ApplicationListItem {...item} isBreeder={isBreeder} />
                  </div>
                  {index < allApplications.length - 1 && <Separator className="bg-grayscale-gray2" />}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="bg-[#F5F5F5] hover:bg-[#EEEEEE] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50"
                >
                  <span className="text-body-s font-medium text-[#545454]">
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
