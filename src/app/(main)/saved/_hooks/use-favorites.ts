'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite, removeFavorite } from '@/api/adopter';

/**
 * 즐겨찾기 목록 조회 hook
 */
export function useFavorites(page: number = 1, limit: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: ['favorites', page, limit],
    queryFn: () => getFavorites(page, limit),
    staleTime: 1000 * 60 * 5, // 5분
    enabled, // 로그인 여부에 따라 조건부 실행
  });
}

/**
 * 즐겨찾기 추가 mutation hook
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (breederId: string) => addFavorite(breederId),
    onSuccess: () => {
      // 즐겨찾기 목록 쿼리 무효화하여 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['favorites'], refetchType: 'all' });
      // 브리더 목록도 무효화 (isFavorited 상태 업데이트)
      queryClient.invalidateQueries({ queryKey: ['breeders'], refetchType: 'all' });
    },
  });
}

/**
 * 즐겨찾기 삭제 mutation hook
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (breederId: string) => removeFavorite(breederId),
    onSuccess: () => {
      // 즐겨찾기 목록 쿼리 무효화하여 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['favorites'], refetchType: 'all' });
      // 브리더 목록도 무효화 (isFavorited 상태 업데이트)
      queryClient.invalidateQueries({ queryKey: ['breeders'], refetchType: 'all' });
    },
  });
}

/**
 * 즐겨찾기 토글 hook (추가/삭제 통합)
 */
export function useToggleFavorite() {
  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  return {
    toggle: (breederId: string, isCurrentlyFavorited: boolean) => {
      if (isCurrentlyFavorited) {
        return removeMutation.mutate(breederId);
      } else {
        return addMutation.mutate(breederId);
      }
    },
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
