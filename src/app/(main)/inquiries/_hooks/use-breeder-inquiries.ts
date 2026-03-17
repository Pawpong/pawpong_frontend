import { useInfiniteQuery } from '@tanstack/react-query';
import { getBreederInquiries } from '@/app/api/inquiry';
import type { InquiryListResponse } from '../_types/inquiry';

export function useBreederInquiries(answered: boolean) {
  return useInfiniteQuery({
    queryKey: ['breeder-inquiries', answered],
    queryFn: ({ pageParam }): Promise<InquiryListResponse> => getBreederInquiries(answered, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
