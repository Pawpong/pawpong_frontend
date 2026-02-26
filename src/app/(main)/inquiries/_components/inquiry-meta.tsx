import type { Inquiry } from '../_types/inquiry';

interface InquiryMetaProps {
  inquiry: Inquiry;
}

const TYPE_LABEL = {
  common: '공통 질문',
  direct: '1:1 질문',
} as const;

export default function InquiryMeta({ inquiry }: InquiryMetaProps) {
  const hasAnswer = inquiry.answerCount > 0;

  return (
    <div className="flex gap-2 items-center text-body-s font-normal text-grayscale-gray5">
      {hasAnswer && inquiry.answerCount > 1 && (
        <>
          <span>다른 브리더 답변 {inquiry.answerCount - 1}개</span>
          <span aria-hidden>·</span>
        </>
      )}
      {!hasAnswer && (
        <>
          <span>답변을 기다리고 있어요</span>
          <span aria-hidden>·</span>
        </>
      )}
      <span>{TYPE_LABEL[inquiry.type]}</span>
      <span aria-hidden>·</span>
      <span>조회수 {inquiry.viewCount}</span>
    </div>
  );
}
