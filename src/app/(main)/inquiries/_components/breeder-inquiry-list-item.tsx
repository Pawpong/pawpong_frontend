import Link from 'next/link';
import { cn } from '@/api/utils';
import { isDeadlineUrgent } from '@/utils/date-utils';
import type { Inquiry } from '../_types/inquiry';
import InquiryAnswer from './inquiry-answer';

interface BreederInquiryListItemProps {
  inquiry: Inquiry;
  answered: boolean;
}

export default function BreederInquiryListItem({ inquiry, answered }: BreederInquiryListItemProps) {
  const urgent = isDeadlineUrgent(inquiry.answerDeadline);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-start justify-between gap-4 w-full">
        <Link href={`/inquiries/${inquiry.id}`} className="flex flex-col gap-2 flex-1 min-w-0">
          <h3 className="text-body-l font-semibold text-primary-500">{inquiry.title}</h3>

          {answered && inquiry.latestAnswer ? (
            <InquiryAnswer inquiryId={inquiry.id} answer={inquiry.latestAnswer} />
          ) : (
            <p className="text-body-m font-medium text-grayscale-gray5 overflow-hidden text-ellipsis line-clamp-2">
              {inquiry.content}
            </p>
          )}

          <div className="flex items-center gap-2 text-body-s font-normal text-grayscale-gray5">
            {inquiry.answerDeadline && (
              <>
                <span>
                  <span className={cn('font-semibold', urgent ? 'text-status-warning500' : 'text-grayscale-gray5')}>
                    답변 마감 기한{'  '}
                  </span>
                  <span className={cn('ml-1', urgent ? 'text-grayscale-gray5' : 'text-grayscale-gray3')}>
                    {inquiry.answerDeadline}
                  </span>
                </span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>1:1 질문</span>
            <span aria-hidden>·</span>
            <span>조회수 {inquiry.viewCount}</span>
          </div>
        </Link>

        {!answered && (
          <Link
            href={`/inquiries/${inquiry.id}#answer`}
            className="shrink-0 flex items-center gap-1 h-8 px-3 py-2 bg-tertiary-500 rounded-lg text-body-xs font-normal text-grayscale-gray6 whitespace-nowrap"
          >
            답변 작성
          </Link>
        )}
      </div>
    </div>
  );
}
