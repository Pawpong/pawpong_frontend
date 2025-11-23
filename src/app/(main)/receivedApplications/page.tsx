"use client";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import ReceivedApplicationListItem from "./_components/received-application-list-item";
import DownArrow from "@/assets/icons/long-down-arrow.svg";
import { useReceivedApplications } from "./_hooks/use-received-applications";

export default function ReceivedApplicationsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useReceivedApplications();
  const allApplications = data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex-1 @container flex flex-col gap-6 md:gap-7 lg:gap-10">
          <div className="text-primary-500 text-heading-3 font-semibold mt-6 md:mt-[1.75rem] lg:mt-[2.5rem]">
            받은 신청
          </div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="flex-1 @container flex flex-col gap-6 md:gap-7 lg:gap-10">
      {allApplications.length === 0 ? (
        <>
          <div className="text-primary-500 text-heading-3 font-semibold mt-6 md:mt-[1.75rem] lg:mt-[2.5rem]">
            받은 신청
          </div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">
              받은 신청이 없습니다.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-primary-500 text-heading-3 font-semibold mt-6 md:mt-[1.75rem] lg:mt-[2.5rem]">
            받은 신청
          </div>
          <div className="flex flex-col gap-[2.5rem] md:gap-[3.75rem] lg:gap-[5rem] mb-[2.5rem] md:mb-[3.75rem] lg:mb-[5rem]">
            <div className="flex flex-col gap-3">
              {allApplications.map((item) => (
                <ReceivedApplicationListItem
                  key={item.id}
                  applicantNickname={item.applicantNickname}
                  animalInfo={item.animalInfo}
                  status={item.status}
                  applicationDate={item.applicationDate}
                />
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="bg-[var(--color-grayscale-gray1)] hover:bg-[var(--color-grayscale-gray2)] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50"
                >
                  <span className="text-body-s font-medium text-grayscale-gray6">
                    {isFetchingNextPage ? "로딩 중..." : "더보기"}
                  </span>
                  <DownArrow />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
