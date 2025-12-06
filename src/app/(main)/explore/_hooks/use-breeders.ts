'use client';

import { useQuery } from '@tanstack/react-query';
import { exploreBreeders, getPopularBreeders, type Breeder, type SearchBreederParams } from '@/lib/breeder';

/**
 * 브리더 목록 검색/필터링 hook
 */
export function useBreeders(params: SearchBreederParams = {}) {
  return useQuery({
    queryKey: ['breeders', params],
    queryFn: () => exploreBreeders(params),
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
