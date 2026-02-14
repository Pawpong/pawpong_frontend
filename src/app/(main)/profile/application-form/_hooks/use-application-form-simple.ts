'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplicationForm, updateApplicationFormSimple } from '@/app/api/breeder-management';
import type { ApplicationFormSimpleUpdateRequest } from '@/app/api/breeder-management';

/**
 * 입양 신청 폼 조회 훅
 */
export function useApplicationForm() {
  return useQuery({
    queryKey: ['application-form'],
    queryFn: () => getApplicationForm(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 입양 신청 폼 간단 수정 훅
 */
export function useUpdateApplicationFormSimple() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplicationFormSimpleUpdateRequest) => updateApplicationFormSimple(data),
    onSuccess: () => {
      // 입양 신청 폼 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['application-form'] });
    },
  });
}
