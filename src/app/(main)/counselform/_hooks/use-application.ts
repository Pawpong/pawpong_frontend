'use client';

import { useMutation } from '@tanstack/react-query';
import { createApplication, type ApplicationCreateRequest } from '@/api/application';

/**
 * 입양 신청 제출 mutation hook
 */
export function useCreateApplication() {
  return useMutation({
    mutationFn: (data: ApplicationCreateRequest) => createApplication(data),
  });
}
