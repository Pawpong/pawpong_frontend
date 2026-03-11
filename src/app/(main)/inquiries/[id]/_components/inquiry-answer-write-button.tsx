import { Button } from '@/components/ui/button';

interface InquiryAnswerWriteButtonProps {
  isActive: boolean;
  hasAnswered: boolean;
  onWriteAnswer: () => void;
}

export default function InquiryAnswerWriteButton({
  isActive,
  hasAnswered,
  onWriteAnswer,
}: InquiryAnswerWriteButtonProps) {
  const disabled = !isActive || hasAnswered;

  return (
    <Button
      variant="tertiary"
      size="lg"
      disabled={disabled}
      onClick={onWriteAnswer}
      className="w-full max-w-[26.5rem] h-12 text-body-s font-semibold"
    >
      답변 작성하기
    </Button>
  );
}
