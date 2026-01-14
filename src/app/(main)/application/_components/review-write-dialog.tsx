'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Separator } from '@/components/ui/separator';

import { useReviewWrite } from '../_hooks/use-review-write';
import ReviewHeader from './review-header';
import BreederSummary from './breeder-summary';
import ReviewTabs from './review-tabs';
import ReviewTextarea from './review-textarea';
import ReviewFooter from './review-footer';

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
  const [activeTab, setActiveTab] = useState<'상담 후기' | '입양 후기'>('상담 후기');
  const [reviewText, setReviewText] = useState('');

  // 다이얼로그가 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      setActiveTab('상담 후기');
      setReviewText('');
    }
  }, [open]);

  const { submitReview, isLoading } = useReviewWrite({
    applicationId,
    onSuccessClose: () => onOpenChange(false),
  });

  const handleSubmit = () => {
    const reviewType = activeTab === '상담 후기' ? 'consultation' : 'adoption';
    submitReview(reviewText, reviewType);
  };

  const placeholder = activeTab === '상담 후기' ? '브리더님과의 상담은 어떠셨나요?' : '입양하는 과정은 어떠셨나요?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[37.5rem] w-full min-h-[37.5rem] max-h-[90vh] md:min-h-[37.5rem] overflow-hidden flex flex-col p-0 gap-0"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>후기 작성</DialogTitle>
        </VisuallyHidden>

        <ReviewHeader onClose={() => onOpenChange(false)} />

        <Separator />

        <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto px-5 pt-6 md:px-6 pb-6">
          <BreederSummary
            breederId={breederId}
            breederName={breederName}
            breederLevel={breederLevel}
            applicationDate={applicationDate}
            profileImage={profileImage}
            animalType={animalType}
            onOpenChange={onOpenChange}
          />

          <div className="flex flex-col gap-4 items-start w-full">
            <ReviewTabs activeTab={activeTab} onChange={setActiveTab} />
            <ReviewTextarea value={reviewText} onChange={setReviewText} placeholder={placeholder} />
          </div>
        </div>

        <ReviewFooter onSubmit={handleSubmit} disabled={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
