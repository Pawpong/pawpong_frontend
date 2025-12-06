'use client';

import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import MyReviewListItem from './_components/my-review-list-item';
import DownArrow from '@/assets/icons/long-down-arrow.svg';
import { useMyReviews } from './_hooks/use-my-reviews';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthGuard } from '@/hooks/use-auth-guard';

const MyApplicationPage = () => {
  const { isLoading: isAuthLoading } = useAuthGuard();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyReviews();
  const allReviews = data?.pages.flatMap((page) => page.data) ?? [];
  const isMdUp = useBreakpoint('md');

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <Container>
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">내 후기</div>
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
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">내 후기</div>

        {allReviews.length === 0 ? (
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

export default MyApplicationPage;
