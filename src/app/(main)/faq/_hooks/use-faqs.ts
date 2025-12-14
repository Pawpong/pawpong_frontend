'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdopterFaqs, getBreederFaqs, type FaqDto } from '@/lib/home';

type UserType = 'adopter' | 'breeder';

/**
 * FAQ 목록 조회 hook
 */
export function useFaqs(userType: UserType) {
  return useQuery({
    queryKey: ['faqs', userType],
    queryFn: () => (userType === 'adopter' ? getAdopterFaqs() : getBreederFaqs()),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
