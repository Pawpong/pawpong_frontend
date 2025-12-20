'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { exploreBreeders, getPopularBreeders, type Breeder, type SearchBreederParams } from '@/lib/breeder';

const PAGE_SIZE = 20;

/**
 * 브리더 목록 검색/필터링 hook (무한스크롤/페이지네이션)
 */
export function useBreeders(params: Omit<SearchBreederParams, 'page' | 'limit'> = {}) {
  return useInfiniteQuery({
    queryKey: ['breeders', params],
    queryFn: ({ pageParam = 1 }) => exploreBreeders({ ...params, page: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 인기 브리더 목록 hook
 */
export function usePopularBreeders() {
  return useQuery({
    queryKey: ['breeders', 'popular'],
    queryFn: () => getPopularBreeders(),
    staleTime: 1000 * 60 * 10, // 10분
  });
}
