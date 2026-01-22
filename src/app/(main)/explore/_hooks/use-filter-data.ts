'use client';

import { useQuery } from '@tanstack/react-query';
import { getBreeds } from '@/api/breeds';
import { getAllDistricts } from '@/api/districts';
import { getAdoptionStatus } from '@/api/filter-options';
import { useMemo } from 'react';

/**
 * Filter 타입 (모달에서 사용하는 구조)
 */
export type Filter = {
  label: string;
  value?: string;
  children?: Filter[];
};

/**
 * API 응답을 Filter 구조로 변환하는 함수들
 */

// Breeds API 응답 → Filter 구조
function transformBreedsToFilter(data: {
  petType: string;
  categories: {
    category: string;
    categoryDescription?: string;
    breeds: string[];
  }[];
}): Filter {
  return {
    label: '품종',
    children: data.categories.map((category) => ({
      label: category.category,
      value: category.category.toLowerCase().replace(/\s+/g, '_'),
      children: category.breeds.map((breed) => ({
        label: breed,
      })),
    })),
  };
}

// Districts API 응답 → Filter 구조
function transformDistrictsToFilter(data: { city: string; districts: string[] }[]): Filter {
  return {
    label: '지역',
    children: data.map((district) => ({
      label: district.city,
      value: district.city,
      children: district.districts.map((city) => ({
        label: city,
      })),
    })),
  };
}

// Adoption Status API 응답 → Filter 구조
function transformAdoptionStatusToFilter(data: { value: boolean; label: string; description: string }[]): Filter {
  return {
    label: '입양 상태',
    children: data.map((status) => ({
      label: status.label,
      value: String(status.value),
    })),
  };
}

/**
 * 필터 타입에 따라 적절한 API를 호출하고 Filter 구조로 변환하는 hook
 * @param filterType - 필터 타입 ("입양 상태" | "품종" | "지역")
 * @param petType - 동물 타입 ("cat" | "dog") - 품종 필터에만 사용됨
 */
export function useFilterData(filterType: '입양 상태' | '품종' | '지역', petType: 'cat' | 'dog') {
  // 품종 데이터 조회
  const breedsQuery = useQuery({
    queryKey: ['breeds', petType],
    queryFn: () => getBreeds(petType),
    enabled: filterType === '품종',
    staleTime: 1000 * 60 * 60, // 1시간
  });

  // 지역 데이터 조회
  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: () => getAllDistricts(),
    enabled: filterType === '지역',
    staleTime: 1000 * 60 * 60, // 1시간
  });

  // 입양 상태 데이터 조회
  const adoptionStatusQuery = useQuery({
    queryKey: ['filter-options', 'adoption-status'],
    queryFn: () => getAdoptionStatus(),
    enabled: filterType === '입양 상태',
    staleTime: 1000 * 60 * 60, // 1시간
  });

  // 데이터를 Filter 구조로 변환
  const filterData = useMemo(() => {
    switch (filterType) {
      case '품종':
        return breedsQuery.data ? transformBreedsToFilter(breedsQuery.data) : null;
      case '지역':
        return districtsQuery.data ? transformDistrictsToFilter(districtsQuery.data) : null;
      case '입양 상태':
        return adoptionStatusQuery.data ? transformAdoptionStatusToFilter(adoptionStatusQuery.data) : null;
      default:
        return null;
    }
  }, [filterType, breedsQuery.data, districtsQuery.data, adoptionStatusQuery.data]);

  // 로딩 및 에러 상태
  const isLoading =
    breedsQuery.isLoading || districtsQuery.isLoading || adoptionStatusQuery.isLoading;

  const error = breedsQuery.error || districtsQuery.error || adoptionStatusQuery.error;

  return {
    data: filterData,
    isLoading,
    error,
  };
}

/**
 * 모든 필터 데이터를 한번에 조회하는 hook
 * 모달이 열릴 때만 사용됩니다.
 * @param petType - 동물 타입
 * @param enabled - API 호출 활성화 여부 (모달이 열렸을 때만 true)
 */
export function useAllFiltersData(petType: 'cat' | 'dog', enabled: boolean = false) {
  // 더보기 눌렀을 때만 각각의 API 호출
  const breedsQuery = useQuery({
    queryKey: ['breeds', petType],
    queryFn: () => getBreeds(petType),
    enabled: enabled, // 모달이 열렸을 때만 호출
    staleTime: 1000 * 60 * 60,
  });

  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: () => getAllDistricts(),
    enabled: enabled, // 모달이 열렸을 때만 호출
    staleTime: 1000 * 60 * 60,
  });

  const adoptionStatusQuery = useQuery({
    queryKey: ['filter-options', 'adoption-status'],
    queryFn: () => getAdoptionStatus(),
    enabled: enabled, // 모달이 열렸을 때만 호출
    staleTime: 1000 * 60 * 60,
  });

  // 모든 데이터를 Filter 배열로 변환
  const allFilters = useMemo(() => {
    if (!adoptionStatusQuery.data || !breedsQuery.data || !districtsQuery.data) {
      return null;
    }

    return [
      transformAdoptionStatusToFilter(adoptionStatusQuery.data),
      transformBreedsToFilter(breedsQuery.data),
      transformDistrictsToFilter(districtsQuery.data),
    ];
  }, [adoptionStatusQuery.data, breedsQuery.data, districtsQuery.data]);

  const isLoading =
    adoptionStatusQuery.isLoading || breedsQuery.isLoading || districtsQuery.isLoading;

  const error = adoptionStatusQuery.error || breedsQuery.error || districtsQuery.error;

  return {
    data: allFilters,
    isLoading,
    error,
  };
}
