import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitInquiryAnswerHelpful } from '@/app/api/inquiry';

/**
 * 문의 답변 "도움됐어요" 등록/취소 훅
 * 성공 시 문의 상세 쿼리 무효화로 집계 갱신
 */
export function useInquiryAnswerHelpful(inquiryId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ answerId }: { answerId: string }) => {
      if (!inquiryId) throw new Error('문의 ID가 없습니다.');
      await submitInquiryAnswerHelpful(inquiryId, answerId);
    },
    onSuccess: () => {
      if (inquiryId) {
        queryClient.invalidateQueries({ queryKey: ['inquiry', inquiryId] });
      }
    },
  });
}
