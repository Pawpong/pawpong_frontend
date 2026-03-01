import { useInfiniteQuery } from '@tanstack/react-query';
import type { AnimalType } from '@/components/animal-tab-bar';
import type { InquiryListResponse, InquirySortType } from '../_types/inquiry';
import { getInquiries } from '@/app/api/inquiry';

export function useInquiries(animal: AnimalType, sort: InquirySortType) {
  return useInfiniteQuery({
    queryKey: ['inquiries', animal, sort],
    queryFn: ({ pageParam }) => getInquiries(pageParam, animal, sort),
    getNextPageParam: (lastPage: InquiryListResponse, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
}
