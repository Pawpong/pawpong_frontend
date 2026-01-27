'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Pencil from '@/assets/icons/pencil.svg';
import SirenMuted from '@/assets/icons/siren-muted.svg';
import ReportDialog from '@/components/report-dialog/report-dialog';

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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const typeLabel = review.reviewType || '후기';

  const handleReplyClick = () => {
    // TODO: 답변 다이얼로그 열기
    console.log('답변하기 클릭:', review.reviewId);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-body-s font-semibold text-grayscale-gray5">
              {review.adopterName || '익명'}
            </div>
            <div className="text-body-s text-grayscale-gray5">
              {typeLabel}・{review.formattedDate}
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-1 text-grayscale-gray5 text-body-xs px-0 has-[>svg]:px-0"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <SirenMuted className="size-5" />
            <div>신고하기</div>
          </Button>
        </div>
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
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        type="review"
        reviewId={review.reviewId}
      />
    </>
  );
}
