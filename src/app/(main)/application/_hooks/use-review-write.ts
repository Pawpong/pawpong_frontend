import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/api/review';
import { useToast } from '@/hooks/use-toast';

interface UseReviewWriteParams {
  applicationId: string;
  onSuccessClose: () => void;
}

export function useReviewWrite({ applicationId, onSuccessClose }: UseReviewWriteParams) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['review-by-application', applicationId] });

      toast({
        title: '후기가 작성되었습니다.',
        position: 'default',
      });
      onSuccessClose();
      router.push('/myapplication');
    },
    onError: (error) => {
      toast({
        title: '후기 작성에 실패했습니다.',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
        position: 'default',
      });
    },
  });

  const submitReview = (content: string, reviewType: 'consultation' | 'adoption') => {
    if (!content.trim()) {
      toast({
        title: '후기 내용을 입력해주세요.',
        position: 'default',
      });
      return;
    }

    mutation.mutate({
      applicationId,
      content,
      reviewType,
    });
  };

  return {
    submitReview,
    isLoading: mutation.isPending,
  };
}
