'use client';

import { use } from 'react';
import Header from '../../_components/header';
import Review from '../_components/review';
import { useBreederProfile, useBreederReviewsInfinite } from '../_hooks/use-breeder-detail';
import { Button } from '@/components/ui/button';
import DownArrow from '@/assets/icons/long-down-arrow.svg';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReviewsPage({ params }: PageProps) {
  const { id: breederId } = use(params);
  const { data: profileData } = useBreederProfile(breederId);
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBreederReviewsInfinite(breederId, 10);

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
          type?: string; // 백엔드 API가 type으로 반환
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
            id: review.reviewId,
            nickname: review.adopterName || review.adopterNickname || '익명',
            date: formattedDate || '날짜 없음',
            content: review.content,
            reviewType: typeMap[review.type || ''] || '상담 후기',
          };
        },
      ) || [];

  // 첫 페이지의 총 개수 확인 (더보기 버튼 표시 여부 결정용)
  const firstPageCount = reviewsData?.pages[0]?.items?.length || 0;

  return (
    <>
      <Header breederNickname={profileData?.breederName || ''} breederId={breederId} hideActions />
      <div className="pt-4 pb-20">
        <div className="flex flex-col items-center gap-10">
          {/* 헤더 */}
          <div className="w-full flex">
            <h1 className="text-heading-3 font-semibold text-primary-500 text-center">후기</h1>
          </div>

          {/* 콘텐츠 */}
          {isReviewsLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
            </div>
          ) : allReviews.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">등록된 후기가 없습니다.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-10 md:gap-[60px] lg:gap-20">
              <div className="w-full flex flex-col gap-8">
                {allReviews.map((review) => (
                  <Review key={review.id} data={review} />
                ))}
              </div>
              {/* 더보기 버튼 - 첫 페이지가 5개 이상이고 다음 페이지가 있을 때만 표시 */}
              {firstPageCount >= 10 && hasNextPage && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => fetchNextPage()}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
