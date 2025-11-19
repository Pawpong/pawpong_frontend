"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { exploreBreeders, type Breeder } from "@/lib/breeder";
import type { HomeAnimalData } from "../_types/home-animal.types";

const PAGE_SIZE = 9;

interface HomeAnimalsResponse {
  data: HomeAnimalData[];
  hasMore: boolean;
}

const fetchHomeAnimals = async (page: number): Promise<HomeAnimalsResponse> => {
  try {
    const response = await exploreBreeders({
      page,
      limit: PAGE_SIZE,
      isAdoptionAvailable: true, // 분양 가능한 브리더만 표시
    });

    // 프론트엔드 Breeder 타입을 HomeAnimalData 타입으로 변환
    // 참고: 현재 백엔드는 브리더 정보를 반환하므로, 동물 개체 정보가 없음
    const data: HomeAnimalData[] = response.breeders.map((breeder: Breeder) => ({
      id: breeder.id,
      avatarUrl: breeder.image,
      name: breeder.name,
      sex: "male", // 브리더 API에는 개별 동물 정보가 없어 기본값 사용
      birth: "상담 시 확인", // 브리더 API에는 개별 동물 정보가 없어 기본값 사용
      price: breeder.price,
      breed: breeder.tags[0] || "",
      status: breeder.status,
    }));

    return {
      data,
      hasMore: response.pagination.hasNextPage,
    };
  } catch (error) {
    console.error("홈 동물 목록 조회 실패:", error);
    return {
      data: [],
      hasMore: false,
    };
  }
};

export const useHomeAnimals = () => {
  return useInfiniteQuery({
    queryKey: ["home-animals"],
    queryFn: ({ pageParam }) => fetchHomeAnimals(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
};
