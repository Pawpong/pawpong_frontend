'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyReviews } from '@/app/api/breeder-management';

/**
 * 브리더가 받은 후기 목록 조회 훅 (무한 스크롤)
 */
export function useMyReviewsInfinite(visibility: string = 'all', limit: number = 10, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['breeder-my-reviews', visibility, limit],
    queryFn: ({ pageParam = 1 }) => getMyReviews(visibility, pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}
