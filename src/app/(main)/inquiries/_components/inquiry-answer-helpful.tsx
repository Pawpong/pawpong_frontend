import Thumb from '@/assets/icons/thumb.svg';

interface InquiryAnswerHelpfulProps {
  helpfulCount: number;
  onClick?: () => void;
}

export default function InquiryAnswerHelpful({ helpfulCount, onClick }: InquiryAnswerHelpfulProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 h-8 rounded-lg bg-tertiary-500 pl-2 pr-3 py-2 text-body-xs font-normal text-grayscale-gray6"
      aria-label={`도움됐어요 ${helpfulCount}명`}
    >
      <Thumb className="size-4 shrink-0 text-grayscale-gray6" aria-hidden />
      <span>도움됐어요</span>
      <span className="text-secondary-800">{helpfulCount}</span>
    </button>
  );
}
