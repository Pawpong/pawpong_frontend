'use client';

import React from 'react';
import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { useBreederReviewsInfinite } from '@/app/(main)/explore/breeder/[id]/_hooks/use-breeder-detail';
import EmptyReviewsState from './_components/empty-reviews-state';
import ReviewListItem from './_components/review-list-item';
import { formatDateToDotNotation } from '@/utils/date-utils';

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  useAuthGuard(); // 인증 체크만 수행
  const { user } = useAuthStore();
  const isMdUp = useBreakpoint('md');
  const breederId = user?.userId || '';

  const {
    data: reviewsData,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBreederReviewsInfinite(breederId, PAGE_SIZE);

  // 모든 페이지의 데이터를 합쳐서 매핑
  const allReviews =
    reviewsData?.pages
      .flatMap((page) => page.items || [])
      .map(
        (review: {
          reviewId: string;
          adopterNickname: string;
          adopterName?: string;
          createdAt: string;
          writtenAt?: string;
          content: string;
          type?: string;
          petName?: string;
          isReported?: boolean;
          breederNickname?: string;
          breederProfileImage?: string | null;
          breedingPetType?: string;
          replyContent?: string | null;
          replyWrittenAt?: string | null;
          replyUpdatedAt?: string | null;
        }) => {
          const typeMap: Record<string, string> = {
            consultation: '상담 후기',
            adoption: '입양 후기',
            adoption_completed: '입양 후기',
          };

          // 날짜 필드: 백엔드에서 writtenAt을 반환
          const dateString = review.writtenAt || review.createdAt;
          const formattedDate = formatDateToDotNotation(dateString);

          return {
            reviewId: review.reviewId,
            adopterName: review.adopterName || review.adopterNickname || '익명',
            comment: review.content,
            petName: review.petName,
            isReported: review.isReported || false,
            createdAt: dateString,
            formattedDate: formattedDate || '날짜 없음',
            reviewType: typeMap[review.type || ''] || '후기',
            breederNickname: review.breederNickname || user?.name,
            breederProfileImage: review.breederProfileImage,
            breedingPetType: review.breedingPetType,
            replyContent: review.replyContent || undefined,
            replyWrittenAt: review.replyWrittenAt || undefined,
            replyUpdatedAt: review.replyUpdatedAt || undefined,
          };
        },
      ) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isError) {
    return (
      <Container>
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">후기를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>

        {allReviews.length === 0 ? (
          <EmptyReviewsState />
        ) : (
          <>
            {/* 후기 리스트 */}
            <div className="flex flex-col gap-7">
              {allReviews.map((review, index) => (
                <div key={review.reviewId} className="flex flex-col">
                  <ReviewListItem review={review} />
                  {(isMdUp ? index !== allReviews.length - 1 : true) && <Separator className="mt-7" />}
                </div>
              ))}
            </div>

            {/* 더보기 버튼 - 후기가 10개 이상이면 표시 */}
            {allReviews.length >= 10 && (
              <div className="mt-4 md:mt-9 lg:mt-10 pb-20 lg:pb-24">
                <LoadMoreButton onClick={handleLoadMore} isLoading={isFetchingNextPage} disabled={!hasNextPage} />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
