'use client';

import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import ApplicationListItem from './_components/application-list-item';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useApplications } from './_hooks/use-applications';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/api/cookie-utils';
import { useState, useEffect } from 'react';
import { LoadingState } from '@/components/loading-state';

const ApplicationPage = () => {
  useAuthGuard(); // 인증 체크만 수행
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApplications();
  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 페이지 제목을 role에 따라 다르게 표시
  const pageTitle = isBreeder ? '받은 신청' : '신청 내역';
  const emptyMessage = isBreeder ? '받은 신청이 없습니다.' : '신청 내역이 없습니다.';

  // 초기 마운트 대기 (Hydration 에러 방지)
  if (!isMounted) {
    return null;
  }

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-3 pt-10 pb-20">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold">{pageTitle}</div>

        {!data ? (
          <LoadingState />
        ) : allApplications.length === 0 ? (
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
            {hasNextPage && <LoadMoreButton onClick={handleLoadMore} isLoading={isFetchingNextPage} variant="custom" />}
          </>
        )}
      </div>
    </Container>
  );
};

export default ApplicationPage;
