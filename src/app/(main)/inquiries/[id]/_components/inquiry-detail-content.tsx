import type { Inquiry } from '../../_types/inquiry';
import InquiryDetailActions from '@/app/(main)/inquiries/[id]/_components/inquiry-detail-actions';
import InquiryDetailAnswers from './inquiry-detail-answers';
import InquiryDetailHeader from './inquiry-detail-header';
import InquiryDetailMeta from './inquiry-detail-meta';

interface InquiryDetailContentProps {
  inquiry: Inquiry;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InquiryDetailContent({ inquiry, onEdit, onDelete }: InquiryDetailContentProps) {
  return (
    <div className="flex flex-col w-full">
      <section className="w-full max-w-[41.25rem] mx-auto pt-10 pb-20 flex flex-col gap-6">
        <InquiryDetailHeader inquiry={inquiry} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <InquiryDetailMeta inquiry={inquiry} />
          <InquiryDetailActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </section>

      <div className="h-2 w-full bg-grayscale-gray1" aria-hidden />

      <InquiryDetailAnswers inquiry={inquiry} />
    </div>
  );
}
