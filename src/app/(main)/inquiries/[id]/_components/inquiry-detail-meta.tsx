import type { Inquiry } from '../../_types/inquiry';

interface InquiryDetailMetaProps {
  inquiry: Inquiry;
}

export default function InquiryDetailMeta({ inquiry }: InquiryDetailMetaProps) {
  const author = inquiry.authorNickname ?? '입양자';
  const date = inquiry.createdAt;
  const viewCount = inquiry.viewCount ?? 0;

  return (
    <div className="flex gap-2 items-center text-body-s text-grayscale-gray5">
      <span className="font-semibold">{author}</span>
      <span aria-hidden>·</span>
      <span className="font-normal">{date}</span>
      <span aria-hidden>·</span>
      <span className="font-normal">조회수 {viewCount}</span>
    </div>
  );
}
