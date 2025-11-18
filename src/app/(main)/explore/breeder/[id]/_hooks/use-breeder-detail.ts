"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBreederProfile,
  getBreederPets,
  getParentPets,
  getBreederReviews,
} from "@/lib/breeder";

/**
 * 브리더 프로필 정보 조회 훅
 */
export function useBreederProfile(breederId: string) {
  return useQuery({
    queryKey: ["breeder-profile", breederId],
    queryFn: () => getBreederProfile(breederId),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 브리더 분양 가능 개체 목록 조회 훅
 */
export function useBreederPets(breederId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["breeder-pets", breederId, page, limit],
    queryFn: () => getBreederPets(breederId, page, limit),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 부모견/부모묘 목록 조회 훅
 */
export function useParentPets(breederId: string) {
  return useQuery({
    queryKey: ["parent-pets", breederId],
    queryFn: () => getParentPets(breederId),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 브리더 후기 목록 조회 훅
 */
export function useBreederReviews(breederId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["breeder-reviews", breederId, page, limit],
    queryFn: () => getBreederReviews(breederId, page, limit),
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5,
  });
}
