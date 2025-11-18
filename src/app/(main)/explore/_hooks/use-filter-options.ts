"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllFilterOptions,
  getBreederLevels,
  getSortOptions,
  getDogSizes,
  getCatFurLengths,
  getAdoptionStatus,
} from "@/lib/filter-options";

/**
 * 전체 필터 옵션 조회 hook
 * 한번에 모든 필터 옵션을 가져옵니다.
 */
export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: () => getAllFilterOptions(),
    staleTime: 1000 * 60 * 60, // 1시간 (필터 옵션은 자주 변경되지 않음)
  });
}

/**
 * 브리더 레벨 옵션 조회 hook
 */
export function useBreederLevels() {
  return useQuery({
    queryKey: ["filter-options", "breeder-levels"],
    queryFn: () => getBreederLevels(),
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * 정렬 옵션 조회 hook
 */
export function useSortOptions() {
  return useQuery({
    queryKey: ["filter-options", "sort-options"],
    queryFn: () => getSortOptions(),
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * 강아지 크기 옵션 조회 hook
 */
export function useDogSizes() {
  return useQuery({
    queryKey: ["filter-options", "dog-sizes"],
    queryFn: () => getDogSizes(),
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * 고양이 털 길이 옵션 조회 hook
 */
export function useCatFurLengths() {
  return useQuery({
    queryKey: ["filter-options", "cat-fur-lengths"],
    queryFn: () => getCatFurLengths(),
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * 입양 가능 여부 옵션 조회 hook
 */
export function useAdoptionStatus() {
  return useQuery({
    queryKey: ["filter-options", "adoption-status"],
    queryFn: () => getAdoptionStatus(),
    staleTime: 1000 * 60 * 60, // 1시간
  });
}
