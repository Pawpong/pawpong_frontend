'use client';

import type { Inquiry } from '../../_types/inquiry';

interface InquiryDetailMetaProps {
  inquiry: Inquiry;
}

export default function InquiryDetailMeta({ inquiry }: InquiryDetailMetaProps) {
  const author = inquiry.authorNickname ?? '입양자';
  const date = inquiry.createdAt;
  const viewCount = inquiry.viewCount ?? 0;

  return (
    <div className="flex gap-2 items-center text-body-s font-normal text-grayscale-gray5">
      <span>{author}</span>
      <span aria-hidden>·</span>
      <span>{date}</span>
      <span aria-hidden>·</span>
      <span>조회수 {viewCount}</span>
    </div>
  );
}
