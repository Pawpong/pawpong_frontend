'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import RightArrow from '@/assets/icons/right-arrow.svg';
import Close from '@/assets/icons/close';
import { cn } from '@/lib/utils';
import { createReview, getReviewByApplicationId, type MyReviewItemDto } from '@/lib/review';
import { useToast } from '@/hooks/use-toast';

interface ReviewWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  breederId: string;
  breederName: string;
  breederLevel: 'elite' | 'new';
  applicationDate: string;
  profileImage: string;
  animalType: 'cat' | 'dog';
}

export default function ReviewWriteDialog({
  open,
  onOpenChange,
  applicationId,
  breederId,
  breederName,
  breederLevel,
  applicationDate,
  profileImage,
  animalType,
}: ReviewWriteDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'상담 후기' | '입양 후기'>('상담 후기');
  const [reviewText, setReviewText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // 기존 후기 조회
  const { data: existingReview, isLoading: isLoadingReview } = useQuery({
    queryKey: ['review-by-application', applicationId],
    queryFn: () => getReviewByApplicationId(applicationId),
    enabled: open && !!applicationId,
  });

  // 기존 후기가 있으면 해당 탭과 내용으로 설정
  useEffect(() => {
    if (existingReview) {
      const reviewTypeMap: Record<string, '상담 후기' | '입양 후기'> = {
        consultation: '상담 후기',
        adoption: '입양 후기',
      };
      setActiveTab(reviewTypeMap[existingReview.reviewType] || '상담 후기');
      setReviewText(existingReview.content);
    }
  }, [existingReview]);

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['review-by-application', applicationId] });
      toast({
        title: '후기가 작성되었습니다.',
      });
      onOpenChange(false);
      router.push('/myapplication');
    },
    onError: (error) => {
      toast({
        title: '후기 작성에 실패했습니다.',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
      });
    },
  });

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      toast({
        title: '후기 내용을 입력해주세요.',
      });
      return;
    }

    const reviewType = activeTab === '상담 후기' ? 'consultation' : 'adoption';

    createReviewMutation.mutate({
      applicationId,
      reviewType,
      content: reviewText,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[37.5rem] w-full overflow-hidden flex flex-col p-0 gap-0',
          existingReview ? '' : 'min-h-[37.5rem] max-h-[41.3125rem] md:min-h-[37.5rem] md:max-h-[41.3125rem]',
        )}
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>후기 작성</DialogTitle>
        </VisuallyHidden>
        {/* 헤더 */}
        <div className="flex flex-col gap-[10px] items-start pt-6 px-5 pb-[10px] md:pt-6 md:px-6 md:pb-[10px]">
          <div className="flex gap-1 items-center justify-end w-full">
            <DialogClose asChild>
              <Button variant="secondary" size="icon">
                <Close className="size-7" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-grayscale-gray2 w-full" />

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div
          className={cn(
            'bg-[var(--color-tertiary-500)] flex flex-col gap-5 min-h-0 px-5 pt-6 md:px-6',
            existingReview ? 'pb-6' : 'pb-[9.25rem] md:pb-[4.5rem]',
          )}
        >
          {/* 브리더 정보 - 전체 클릭 시 브리더 페이지로 이동 */}
          <div
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              onOpenChange(false);
              router.push(`/explore/breeder/${breederId}`);
            }}
          >
            <div className="flex gap-5 items-center grow">
              <ProfileImageWithBadge src={profileImage} alt={breederName} animalType={animalType} size={68} />
              <BreederInfo
                breederName={breederName}
                breederLevel={breederLevel}
                applicationDate={applicationDate}
                className="gap-3"
              />
            </div>
            <Button
              className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <span>보기</span>
              <RightArrow className="size-5" />
            </Button>
          </div>

          {/* 탭 및 후기 작성 영역 */}
          <div className="flex flex-col gap-5 items-start w-full">
            {/* 탭 - 기존 후기가 있으면 클릭 불가 */}
            <div className="flex gap-4 items-start">
              <button
                onClick={() => !existingReview && setActiveTab('상담 후기')}
                className={cn('flex flex-col items-start', existingReview && 'cursor-default')}
                disabled={!!existingReview}
              >
                <p
                  className={cn(
                    'text-body-m font-semibold',
                    activeTab === '상담 후기' ? 'text-primary' : 'text-grayscale-gray5',
                  )}
                >
                  상담 후기
                </p>
                <div className="h-[2px] w-full mt-1.5">
                  {activeTab === '상담 후기' && <div className="bg-primary-500 h-[2px] w-full" />}
                </div>
              </button>
              <button
                onClick={() => !existingReview && setActiveTab('입양 후기')}
                className={cn('flex flex-col items-start', existingReview && 'cursor-default')}
                disabled={!!existingReview}
              >
                <p
                  className={cn(
                    'text-body-m font-semibold',
                    activeTab === '입양 후기' ? 'text-primary' : 'text-grayscale-gray5',
                  )}
                >
                  입양 후기
                </p>
                <div className="h-[2px] w-full mt-1.5">
                  {activeTab === '입양 후기' && <div className="bg-primary-500 h-[2px] w-full" />}
                </div>
              </button>
            </div>

            {/* 후기 Textarea - 기존 후기가 있으면 읽기 전용 */}
            <div className="bg-white flex flex-col items-start overflow-clip rounded-lg w-full">
              <div className="box-border flex flex-col gap-[var(--space-16)] items-start overflow-clip pb-0 pt-[var(--space-12)] px-[var(--space-16)] relative shrink-0 w-full">
                {existingReview ? (
                  // 기존 후기 표시 (읽기 전용)
                  <div className="min-h-[140px] text-body-s text-grayscale-gray6 whitespace-pre-wrap">
                    {reviewText}
                  </div>
                ) : (
                  // 후기 작성 (편집 가능)
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={
                      activeTab === '상담 후기' ? '브리더님과의 상담은 어떠셨나요?' : '입양하는 과정은 어떠셨나요?'
                    }
                    maxLength={800}
                    showLength={false}
                    currentLength={reviewText.length}
                    className="min-h-[140px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-body-s placeholder:text-grayscale-gray5"
                  />
                )}
              </div>
              {!existingReview && (
                <div className="bg-white box-border flex gap-[10px] items-center justify-end pb-[var(--space-12)] pt-[var(--space-16)] px-[var(--space-16)] relative rounded-bl-lg rounded-br-lg shrink-0 w-full min-h-[44px]">
                  <p
                    className={`text-[14px] font-medium text-grayscale-gray5 text-right leading-[20px] ${
                      isFocused ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="text-[#4e9cf1]">{reviewText.length}</span>
                    /800
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 - 기존 후기가 없을 때만 표시 */}
        {!existingReview && (
          <>
            {/* 구분선 */}
            <div className="h-px bg-grayscale-gray2 w-full shrink-0" />
            <div className="bg-white flex gap-2.5 items-start justify-end overflow-clip pb-4 pt-4 px-5 md:pb-6 md:pt-4 md:px-6 shrink-0">
              <button className="button-brown" onClick={handleSubmit}>
                후기 작성하기
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
