'use client';

import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import Pencil from '@/assets/icons/pencil.svg';

interface ReviewListItemProps {
  review: {
    reviewId: string;
    adopterName: string;
    comment: string;
    petName?: string;
    isReported?: boolean;
    createdAt: string;
    formattedDate: string;
    reviewType: string;
  };
}

export default function ReviewListItem({ review }: ReviewListItemProps) {
  const isMobile = !useBreakpoint('md');
  const typeLabel = review.reviewType || '후기';

  const handleReplyClick = () => {
    // TODO: 답변 다이얼로그 열기
    console.log('답변하기 클릭:', review.reviewId);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-body-s font-semibold text-grayscale-gray5">
            {review.adopterName || '익명'}
          </div>
          {!isMobile && (
            <div className="text-body-s text-grayscale-gray5">
              {typeLabel}・{review.formattedDate}
            </div>
          )}
        </div>
        {review.isReported && (
          <div className="text-body-xs text-status-error-500">신고됨</div>
        )}
      </div>
      {isMobile && (
        <div className="text-body-s text-grayscale-gray5">
          {typeLabel}・{review.formattedDate}
        </div>
      )}
      <div className="font-medium text-body-m text-primary-500 break-all">{review.comment}</div>
      
      {/* 답변하기 버튼  */}
      <div className="mt-2">
        <Button
          variant="secondary"
          className="px-0 py-2 pr-2 pl-3 gap-1 shrink-0"
          onClick={handleReplyClick}
        >
        
          <span className="text-body-xs font-normal text-grayscale-gray6">답글 작성</span>
            <Pencil className="size-4" />
        </Button>
      </div>
    </div>
  );
}
