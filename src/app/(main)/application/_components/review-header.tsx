import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Close from '@/assets/icons/close';

interface ReviewHeaderProps {
  onClose: () => void;
}

export default function ReviewHeader({ onClose }: ReviewHeaderProps) {
  return (
    <div className="flex flex-col gap-[10px] items-start pt-6 px-5 pb-[10px] md:pt-6 md:px-6 md:pb-[10px] shrink-0">
      <div className="flex gap-1 items-center justify-end w-full">
        <DialogClose asChild>
          <Button variant="secondary" size="icon" onClick={onClose}>
            <Close className="size-7" />
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
