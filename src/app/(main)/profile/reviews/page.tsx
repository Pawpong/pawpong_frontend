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

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const { isLoading: isAuthLoading } = useAuthGuard();
  const { user } = useAuthStore();
  const isMdUp = useBreakpoint('md');
  const breederId = user?.userId || '';

  const {
    data: reviewsData,
    isLoading,
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
        }) => {
          const typeMap: Record<string, string> = {
            consultation: '상담 후기',
            adoption: '입양 후기',
            adoption_completed: '입양 후기',
          };

          // 날짜 필드: 백엔드에서 writtenAt을 반환
          const dateString = review.writtenAt || review.createdAt;
          let formattedDate = '';

          if (dateString) {
            try {
              const date = new Date(dateString);
              formattedDate = date.toLocaleDateString('ko-KR');
            } catch {
              formattedDate = '날짜 없음';
            }
          }

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
          };
        },
      ) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <Container>
        <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>
          <div className="flex justify-center py-20">
            <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
          </div>
        </div>
      </Container>
    );
  }

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
            <div className="flex flex-col gap-7">
              {allReviews.map((review, index) => (
                <div key={review.reviewId} className="flex flex-col">
                  <ReviewListItem review={review} />
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
}
