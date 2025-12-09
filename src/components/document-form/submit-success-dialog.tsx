'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubmitSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
}

export default function SubmitSuccessDialog({ open, onOpenChange, onGoHome }: SubmitSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-heading-3 font-semibold text-[#4F3B2E] text-center">
            입점 서류 제출을 완료했어요!
          </DialogTitle>
          <DialogDescription className="text-body-s text-grayscale-gray5 text-center mt-2">
            관리자 검토 후 결과를 알려드릴게요.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button variant="tertiary" className="w-full py-3" onClick={onGoHome}>
            홈으로
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
