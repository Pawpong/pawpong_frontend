import Cat from '@/assets/icons/cat';
import type { InquiryAnswer as InquiryAnswerType } from '../_types/inquiry';

interface InquiryAnswerProps {
  answer: InquiryAnswerType;
}

export default function InquiryAnswer({ answer }: InquiryAnswerProps) {
  return (
    <div className="bg-grayscale-gray1 flex flex-col gap-2 p-5 rounded-lg w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2.5 items-center">
          <div className="relative size-8 bg-white rounded-lg flex items-center justify-center shrink-0">
            <Cat className="size-6 text-primary-500" />
          </div>
          <p className="text-body-m font-semibold text-secondary-700">{answer.breederName}님 답변</p>
        </div>
        <p className="text-body-s font-normal text-grayscale-gray5">{answer.answeredAt}</p>
      </div>
      <p className="text-body-m font-medium text-grayscale-gray6 overflow-hidden text-ellipsis whitespace-nowrap">
        {answer.content}
      </p>
    </div>
  );
}
