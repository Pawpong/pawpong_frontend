'use client';

import InquiryAnswer from '../../_components/inquiry-answer';
import { Separator } from '@/components/ui/separator';
import type { Inquiry } from '../../_types/inquiry';
import InquiryDetailActions from '@/app/(main)/inquiries/[id]/_components/inquiry-detail-actions';
import InquiryDetailHeader from './inquiry-detail-header';
import InquiryDetailMeta from './inquiry-detail-meta';
import InquiryWaitingAnswer from './inquiry-waiting-answer';

interface InquiryDetailContentProps {
  inquiry: Inquiry;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InquiryDetailContent({ inquiry, onEdit, onDelete }: InquiryDetailContentProps) {
  const hasAnswers = inquiry.answerCount > 0 && (inquiry.answers?.length ?? 0) > 0;
  const answers = inquiry.answers ?? (inquiry.latestAnswer ? [inquiry.latestAnswer] : []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <InquiryDetailHeader inquiry={inquiry} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InquiryDetailMeta inquiry={inquiry} />
        <InquiryDetailActions onEdit={onEdit} onDelete={onDelete} />
      </div>

      <Separator className="bg-grayscale-gray3" />

      {hasAnswers ? (
        <div className="flex flex-col gap-3">
          {answers.map((answer, index) => (
            <InquiryAnswer key={`${answer.breederName}-${answer.answeredAt}-${index}`} answer={answer} />
          ))}
        </div>
      ) : (
        <InquiryWaitingAnswer />
      )}
    </div>
  );
}
