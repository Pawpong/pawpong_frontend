import { useQuery } from '@tanstack/react-query';
import { getInquiryDetail } from '@/app/api/inquiry';

export function useInquiryDetail(id: string | null) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => getInquiryDetail(id!),
    enabled: !!id,
  });
}
