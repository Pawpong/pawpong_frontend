'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubmitSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoHome: () => void;
}

export default function SubmitSuccessDialog({ open, onOpenChange, onGoHome }: SubmitSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] p-8 rounded-2xl" showCloseButton={false}>
        <div className="flex flex-col items-center gap-3">
          {/* 체크 아이콘 */}
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#005DF9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 타이틀 */}
          <h2 className="text-heading-3 font-semibold text-primary-500 text-center">입점 서류 제출을 완료했어요!</h2>

          {/* 설명 */}
          <p className="text-body-s text-grayscale-gray5 text-center">
            브리더 심사는 <span className="text-primary-500 font-medium">최대 3 영업일</span> 정도
            <br />
            소요될 수 있어요.
          </p>
        </div>

        {/* 홈으로 버튼 */}
        <div className="mt-4">
          <Button variant="tertiary" className="w-full py-3" onClick={onGoHome}>
            홈으로
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
