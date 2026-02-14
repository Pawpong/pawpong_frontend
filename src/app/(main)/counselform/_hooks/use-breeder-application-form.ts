'use client';

import { useQuery } from '@tanstack/react-query';
import { getBreederApplicationForm } from '@/app/api/breeder';

/**
 * 브리더 입양 신청 폼 조회 훅 (입양자용)
 */
export function useBreederApplicationForm(breederId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['breeder-application-form', breederId],
    queryFn: () => getBreederApplicationForm(breederId),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: enabled && !!breederId,
  });
}
