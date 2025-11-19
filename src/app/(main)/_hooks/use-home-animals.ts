"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  homeAnimalMockData,
  type HomeAnimalData,
} from "../_mocks/home-animal-mock-data";

const PAGE_SIZE = 9;

interface HomeAnimalsResponse {
  data: HomeAnimalData[];
  hasMore: boolean;
}

const fetchHomeAnimals = async (page: number): Promise<HomeAnimalsResponse> => {
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const data = homeAnimalMockData.slice(startIndex, endIndex);
  return {
    data,
    hasMore: endIndex < homeAnimalMockData.length,
  };
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
