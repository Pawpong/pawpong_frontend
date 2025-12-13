'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyApplications, type ApplicationListItemDto } from '@/lib/application';

interface MyApplicationsResponse {
  data: ApplicationListItemDto[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const fetchMyApplications = async (page: number, animalType?: 'cat' | 'dog'): Promise<MyApplicationsResponse> => {
  const result = await getMyApplications(page, PAGE_SIZE, animalType);

  return {
    data: result.applications,
    hasMore: result.pagination.hasNextPage,
  };
};

export function useMyApplications(animalType?: 'cat' | 'dog') {
  return useInfiniteQuery({
    queryKey: ['my-applications', animalType],
    queryFn: ({ pageParam }) => fetchMyApplications(pageParam, animalType),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
