'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getBreederProfile, getBreederPets, getParentPets, getBreederReviews } from '@/api/breeder';

/**
 * 브리더 프로필 정보 조회 훅
 */
export function useBreederProfile(breederId: string) {
  return useQuery({
    queryKey: ['breeder-profile', breederId],
    queryFn: () => getBreederProfile(breederId),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false, // 에러 발생 시 재시도하지 않음 (탈퇴한 브리더 체크용)
  });
}

/**
 * 브리더 분양 가능 개체 목록 조회 훅
 */
export function useBreederPets(breederId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['breeder-pets', breederId, page, limit],
    queryFn: () => getBreederPets(breederId, page, limit),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 분양 가능 개체 목록 조회 훅 (무한 스크롤)
 */
export function useBreederPetsInfinite(breederId: string, limit: number = 10) {
  return useInfiniteQuery({
    queryKey: ['breeder-pets-infinite', breederId, limit],
    queryFn: ({ pageParam = 1 }) => getBreederPets(breederId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 부모견/부모묘 목록 조회 훅 (페이지네이션)
 */
export function useParentPets(breederId: string, page: number = 1, limit: number = 4) {
  return useQuery({
    queryKey: ['parent-pets', breederId, page, limit],
    queryFn: () => getParentPets(breederId, page, limit),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 부모견/부모묘 목록 조회 훅 (무한 스크롤)
 */
export function useParentPetsInfinite(breederId: string, limit: number = 4) {
  return useInfiniteQuery({
    queryKey: ['parent-pets-infinite', breederId, limit],
    queryFn: ({ pageParam = 1 }) => getParentPets(breederId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 후기 목록 조회 훅
 */
export function useBreederReviews(breederId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['breeder-reviews', breederId, page, limit],
    queryFn: () => getBreederReviews(breederId, page, limit),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 후기 목록 조회 훅 (무한 스크롤)
 */
export function useBreederReviewsInfinite(breederId: string, limit: number = 5) {
  return useInfiniteQuery({
    queryKey: ['breeder-reviews-infinite', breederId, limit],
    queryFn: ({ pageParam = 1 }) => getBreederReviews(breederId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}
