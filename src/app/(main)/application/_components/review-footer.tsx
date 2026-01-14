import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ReviewFooterProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export default function ReviewFooter({ onSubmit, disabled = false }: ReviewFooterProps) {
  return (
    <>
      <Separator />
      <div className="bg-white flex gap-2.5 items-start justify-end pb-4 pt-4 px-5 md:pb-6 md:pt-4 md:px-6 shrink-0">
        <Button variant="primary" className="min-w-[4.5rem]  py-2 rounded px-4" onClick={onSubmit} disabled={disabled}>
          후기 작성하기
        </Button>
      </div>
    </>
  );
}
