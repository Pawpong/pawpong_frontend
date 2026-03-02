import Thumb from '@/assets/icons/thumb.svg';
import { Button } from '@/components/ui/button';
import { useInquiryAnswerHelpful } from '../_hooks/use-inquiry-answer-helpful';

interface InquiryAnswerHelpfulProps {
  inquiryId: string | null;
  answerId?: string;
  helpfulCount: number;
}

export default function InquiryAnswerHelpful({ inquiryId, answerId, helpfulCount }: InquiryAnswerHelpfulProps) {
  const { mutate, isPending } = useInquiryAnswerHelpful(inquiryId);

  const handleClick = () => {
    if (answerId) mutate({ answerId });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="default"
      onClick={handleClick}
      disabled={!answerId || isPending}
      className="h-8 gap-1 pl-2 pr-3 py-2 rounded-lg text-grayscale-gray6 font-normal hover:bg-tertiary-600 active:bg-secondary-500"
      aria-label={`도움됐어요 ${helpfulCount}명`}
    >
      <Thumb className="size-4 shrink-0 text-grayscale-gray6" aria-hidden />
      <span>도움됐어요</span>
      <span className="text-secondary-800">{helpfulCount}</span>
    </Button>
  );
}
