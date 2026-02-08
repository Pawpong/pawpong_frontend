'use client';

import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import MyReviewListItem from './_components/my-review-list-item';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useMyReviews } from './_hooks/use-my-reviews';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { LoadingState } from '@/components/loading-state';

const MyApplicationPage = () => {
  useAuthGuard(); // 인증 체크만 수행
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyReviews();
  const allReviews = data?.pages.flatMap((page) => page.data) ?? [];
  const isMdUp = useBreakpoint('md');

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">내 후기</div>

        {!data ? (
          <LoadingState />
        ) : allReviews.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">작성한 후기가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-7">
              {allReviews.map((item, index) => (
                <div key={`${item.breederId}-${index}`} className="flex flex-col">
                  <MyReviewListItem {...item} />
                  {(isMdUp ? index !== allReviews.length - 1 : true) && <Separator className="mt-7" />}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasNextPage && (
              <LoadMoreButton
                onClick={handleLoadMore}
                isLoading={isFetchingNextPage}
                wrapperClassName="pb-20 lg:pb-24"
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default MyApplicationPage;
