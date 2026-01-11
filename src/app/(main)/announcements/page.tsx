'use client';

import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import NoticeListItem from './_components/notice-list-item';
import NoticeDialog from './_components/notice-dialog';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useNotices } from './_hooks/use-notices';

export default function InformationPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotices();
  const allNotices = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Container className="pb-20">
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">공지사항</div>
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
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">공지사항</div>

        {allNotices.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">공지사항이 없습니다.</p>
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
                  {index !== allNotices.length - 1 && <Separator className="mt-7" />}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
                wrapperClassName="pb-20"
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
}
