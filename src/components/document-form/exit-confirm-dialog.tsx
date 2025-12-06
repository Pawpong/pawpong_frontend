'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ExitConfirmDialog({ open, onOpenChange, onConfirm }: ExitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-heading-3 font-semibold text-[#4F3B2E] text-center">
            작성 중인 내용이 있어요
          </DialogTitle>
          <DialogDescription className="text-body-s text-grayscale-gray5 text-center mt-2">
            페이지를 나가면 작성 중인 내용이 저장되지 않아요.
            <br />
            정말 나가시겠어요?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            className="flex-1 py-3 bg-grayscale-gray1 hover:bg-grayscale-gray2"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button variant="tertiary" className="flex-1 py-3" onClick={onConfirm}>
            나가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
