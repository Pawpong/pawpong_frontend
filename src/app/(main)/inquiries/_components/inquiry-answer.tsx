import Cat from '@/assets/icons/cat';
import type { InquiryAnswer as InquiryAnswerType } from '../_types/inquiry';
import InquiryDetailImages from '../[id]/_components/inquiry-detail-images';

interface InquiryAnswerProps {
  answer: InquiryAnswerType;
}

export default function InquiryAnswer({ answer }: InquiryAnswerProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-secondary-100 rounded-lg p-5 flex items-center justify-between gap-4 w-full">
        <div className="flex min-w-0 flex-1 gap-4 items-center">
          <div className="relative size-12 bg-white rounded-lg flex items-center justify-center shrink-0">
            <Cat className="size-6 text-primary-500" />
          </div>
          <p className="text-body-l font-semibold text-primary-500 truncate">{answer.breederName}</p>
        </div>
        <button
          type="button"
          className="h-8 rounded-lg bg-white pl-[0.75rem] pr-[0.75rem] text-body-xs font-normal text-grayscale-gray6 whitespace-nowrap"
        >
          입양 신청하기
        </button>
      </div>

      <p className="text-body-m font-medium text-grayscale-gray6 whitespace-pre-wrap">
        {answer.content}
      </p>

      <InquiryDetailImages imageUrls={answer.imageUrls} placeholderCount={4} />

      <div className="flex items-center justify-between w-full">
        <p className="text-body-s font-normal text-grayscale-gray5">{answer.answeredAt}</p>
        <button
          type="button"
          className="h-8 rounded-lg bg-tertiary-500 pl-[0.75rem] pr-[0.75rem] text-body-xs font-normal text-grayscale-gray6 whitespace-nowrap"
        >
          도움됐어요 {answer.helpfulCount ?? 0}
        </button>
      </div>
    </div>
  );
}
