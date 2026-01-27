'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Check from '@/assets/icons/check-default.svg';
import Pencil from '@/assets/icons/pencil.svg';
import SirenMuted from '@/assets/icons/siren-muted.svg';
import Close from '@/assets/icons/close-default.svg';
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
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const typeLabel = review.reviewType || '후기';

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    // TODO: 답글 제출 API 호출
    console.log('답글 제출:', review.reviewId, replyText);
    setIsReplying(false);
    setReplyText('');
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
      
      {/* 답글 작성 버튼 또는 답글 작성 폼 */}
      {!isReplying ? (
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
      ) : (
        <div className="mt-4">
          <div className="bg-grayscale-gray1 rounded-lg flex flex-col relative min-h-[200px]">
            {/* 텍스트 입력 영역 */}
            <div className="bg-grayscale-gray1 pt-[var(--space-12)] pr-[var(--space-16)] pb-0 pl-[var(--space-16)] flex-1 rounded-lg">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="상담 및 입양 과정에 대한 감사 인사나 후기를 남겨주세요"
                maxLength={800}
                showLength={false}
                currentLength={replyText.length}
                wrapperClassName="bg-grayscale-gray1"
                className="min-h-[8rem] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-body-xs placeholder:text-grayscale-gray5 resize-none"
              />
            </div>
            {/* 하단 영역: 문자 카운터 + 버튼 */}
            <div className="flex items-center justify-between pt-[var(--space-12)] pr-[var(--space-16)] pb-[var(--space-16)] pl-[var(--space-16)]">
              {/* 문자 카운터 - 왼쪽 */}
              <div className="text-[14px] font-medium leading-[20px]">
                <span className="text-[#4e9cf1]">{replyText.length}</span>
                <span className="text-grayscale-gray5">/800</span>
              </div>
              {/* 버튼들 - 오른쪽 */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="bg-white text-body-xs text-grayscale-gray6 gap-1 pt-[var(--space-8)] pr-[var(--space-8)] pb-[var(--space-8)] pl-[var(--space-12)]  hover:bg-gray-50 border-0"
                  onClick={handleCancelReply}
                >
                  취소
                  <Close />
                </Button>
                <Button
                  variant="tertiary"
                  className="pt-[var(--space-8)] pr-[var(--space-8)] pb-[var(--space-8)] pl-[var(--space-12)] text-body-xs gap-1 text-white border-0 text-grayscale-gray6"
                  onClick={handleSubmitReply}
             
                >
                  등록
                  <Check  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
