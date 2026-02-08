import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationStatus } from '@/api/breeder';
import { toast } from '@/hooks/use-toast';

interface UpdateApplicationStatusParams {
  applicationId: string;
  status: 'consultation_completed' | 'consultation_pending';
  onSuccess?: () => void;
}

/**
 * 입양 신청 상태 업데이트 훅 (브리더용 - /application 경로)
 * 낙관적 업데이트 + 에러 처리 + Toast 알림 포함
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }: UpdateApplicationStatusParams) => {
      return await updateApplicationStatus(applicationId, {
        applicationId,
        status,
      });
    },
    // 낙관적 업데이트: 성공 시 즉시 UI 반영
    onMutate: async ({ applicationId, status }) => {
      // 진행 중인 쿼리 취소 (낙관적 업데이트 충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['application', applicationId] });
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousApplicationData = queryClient.getQueryData(['application', applicationId]);
      const previousApplicationsData = queryClient.getQueryData(['applications']);

      // 낙관적 업데이트: 캐시를 즉시 수정
      queryClient.setQueryData(['application', applicationId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          status,
        };
      });

      // 롤백을 위해 이전 데이터 반환
      return { previousApplicationData, previousApplicationsData };
    },
    // 성공 시: Toast 알림 + 쿼리 무효화
    onSuccess: (data, variables) => {
      const statusText = variables.status === 'consultation_completed' ? '상담 완료' : '완료 취소';
      const descriptionText =
        variables.status === 'consultation_completed'
          ? '상담이 완료되었습니다. 입양자에게 알림이 전송되었습니다.'
          : '상담 완료가 취소되었습니다.';

      toast({
        title: statusText,
        description: descriptionText,
        position: 'default',
      });

      // 서버와 최종 동기화
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    // 에러 시: 롤백 + 에러 알림
    onError: (error, variables, context) => {
      // 낙관적 업데이트 롤백
      if (context?.previousApplicationData) {
        queryClient.setQueryData(['application', variables.applicationId], context.previousApplicationData);
      }
      if (context?.previousApplicationsData) {
        queryClient.setQueryData(['applications'], context.previousApplicationsData);
      }

      const errorMessage =
        variables.status === 'consultation_completed'
          ? '상담 완료 처리 중 오류가 발생했습니다.'
          : '완료 취소 처리 중 오류가 발생했습니다.';

      toast({
        title: '오류',
        description: error instanceof Error ? error.message : errorMessage,
        position: 'default',
      });
    },
  });
}
