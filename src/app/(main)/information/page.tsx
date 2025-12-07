"use client";

import Container from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import NoticeListItem from "./_components/notice-list-item";
import NoticeDialog from "./_components/notice-dialog";
import DownArrow from "@/assets/icons/long-down-arrow.svg";
import { useNotices } from "./_hooks/use-notices";

export default function InformationPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotices();
  const allNotices = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Container className="pb-20">
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">
            공지사항
          </div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-20">
      <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">
          공지사항
        </div>

        {allNotices.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">
              공지사항이 없습니다.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-7">
              {allNotices.map((notice, index) => (
                <div key={notice.id} className="flex flex-col">
                  <NoticeDialog notice={notice}>
                    <button className="text-left w-full">
                      <NoticeListItem title={notice.title} date={notice.date} />
                    </button>
                  </NoticeDialog>
                  {index !== allNotices.length - 1 && (
                    <Separator className="mt-7" />
                  )}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <div className="flex justify-center pb-20">
                <Button
                  variant="ghost"
                  onClick={() => fetchNextPage()}
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
          </>
        )}
      </div>
    </Container>
  );
}
