import Link from 'next/link';
import type { Inquiry } from '../_types/inquiry';
import InquiryAnswer from './inquiry-answer';
import InquiryMeta from './inquiry-meta';

interface InquiryListItemProps {
  inquiry: Inquiry;
}

export default function InquiryListItem({ inquiry }: InquiryListItemProps) {
  const hasAnswer = !!inquiry.latestAnswer;

  return (
    <Link href={`/inquiries/${inquiry.id}`} className="flex flex-col gap-3 w-full">
      <h3 className="text-body-l font-semibold text-primary-500">{inquiry.title}</h3>

      {hasAnswer ? (
        <InquiryAnswer inquiryId={inquiry.id} answer={inquiry.latestAnswer!} />
      ) : (
        <p className="text-body-m font-medium text-grayscale-gray5 overflow-hidden text-ellipsis line-clamp-2">
          {inquiry.content}
        </p>
      )}

      <InquiryMeta inquiry={inquiry} />
    </Link>
  );
}
