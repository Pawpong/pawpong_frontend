'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import ApplicationListItem from './_components/shared/application-list-item';
import { ApplicationStatusBadge } from './_components/shared/application-status-badge';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useApplications } from './_hooks/use-applications';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/api/cookie-utils';
import { LoadingState } from '@/components/loading-state';
import ApplicationDetailModal from './_components/detail/application-detail-modal';
import { Button } from '@/components/ui/button';

export default function ApplicationPage() {
  useAuthGuard();
  const { user } = useAuthStore();
  const [isBreeder, setIsBreeder] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const cookieRole = getUserRoleFromCookie();
    const userRole = cookieRole || user?.role;
    setIsBreeder(userRole === 'breeder');
    setIsMounted(true);
  }, [user?.role]);

  if (!isMounted) return null;

  return isBreeder ? <BreederApplicationList /> : <AdopterApplicationList />;
}

function BreederApplicationList() {
  const router = useRouter();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApplications();
  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 md:gap-7 lg:gap-10 pt-10 pb-20">
        <div className="text-primary-500 text-heading-3 font-semibold">받은 신청</div>

        {!data ? (
          <LoadingState />
        ) : allApplications.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">받은 신청이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {allApplications.map((app) => (
                <div
                  key={app.applicationId}
                  className="bg-tertiary-500 flex flex-col p-5 rounded-lg w-full cursor-pointer hover:bg-tertiary-600 transition-colors"
                  onClick={() => router.push(`/application/chat/${app.applicationId}`)}
                >
                  <div className="grid grid-cols-[1fr_auto] grid-rows-2 items-start gap-x-3 gap-y-1 w-full">
                    <h3 className="text-body-m font-medium text-primary-500 truncate">
                      {app.adopterName || '입양 신청자'}
                    </h3>
                    <p className="text-body-s font-normal text-grayscale-gray5 shrink-0 text-right">{app.applicationDate}</p>
                    <p className="text-body-s font-normal text-grayscale-gray5 overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {app.preferredPetInfo || app.petName || '분양 중인 아이 정보'}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="tertiary"
                        className="h-7 px-2.5 py-0 text-caption"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplicationId(app.applicationId);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        신청서 보기
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                isLoading={isFetchingNextPage}
                variant="custom"
              />
            )}
          </>
        )}
      </div>
      {selectedApplicationId && (
        <ApplicationDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          applicationId={selectedApplicationId}
          showActions={false}
        />
      )}
    </Container>
  );
}

function AdopterApplicationList() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApplications();
  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 md:gap-7 lg:gap-10 pt-10 pb-20">
        <div className="text-primary-500 text-heading-3 font-semibold">신청 내역</div>

        {!data ? (
          <LoadingState />
        ) : allApplications.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">신청 내역이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {allApplications.map((item, index) => (
                <div key={item.applicationId || `application-${index}`}>
                  <ApplicationListItem
                    {...item}
                    isBreeder={false}
                    onChatClick={() => router.push(`/application/chat/${item.applicationId}`)}
                  />
                  {index < allApplications.length - 1 && (
                    <div className="py-[28px]">
                      <Separator className="bg-grayscale-gray2" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {hasNextPage && (
              <LoadMoreButton
                onClick={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
                isLoading={isFetchingNextPage}
                variant="custom"
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
}
