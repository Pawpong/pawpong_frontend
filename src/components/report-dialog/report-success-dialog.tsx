"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import Check from "@/assets/icons/check";

interface ReportSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export default function ReportSuccessDialog({
  open,
  onOpenChange,
  onConfirm,
}: ReportSuccessDialogProps) {
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="bg-[var(--color-alpha-dimmer)]" />
        <AlertDialogPrimitive.Content
          className={cn(
            "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 flex flex-col w-full max-w-[20rem] sm:max-w-[360px] translate-x-[-50%] translate-y-[-50%] rounded-[16px] shadow-lg duration-200 overflow-hidden"
          )}
        >
          {/* 상단 영역 */}
          <div className="flex flex-col gap-3 items-center pb-4 pt-8 px-4">
            {/* 체크 아이콘 */}
            <div className="size-[60px] flex items-center justify-center">
              <div className="size-[53.33px] bg-[var(--color-status-success-100)] rounded-full flex items-center justify-center">
                <Check className="size-[26.67px] text-[var(--color-status-success-500)]" />
              </div>
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-col gap-1.5 items-center text-center w-full">
              <AlertDialogTitle className="text-body-l font-semibold leading-[32px] text-grayscale-black mb-0">
                후기를 신고했어요
              </AlertDialogTitle>
              <AlertDialogDescription className="text-body-s font-normal leading-[24px] text-grayscale-gray6 mt-0">
                신고해주셔서 감사합니다.
              </AlertDialogDescription>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex flex-col gap-3 items-center justify-end pb-5 pt-4 px-4">
            <AlertDialogAction
              onClick={handleConfirm}
              className="w-full h-12 bg-[#4F3B2E] text-[var(--color-secondary-500)] hover:bg-[#4F3B2E] hover:text-[var(--color-secondary-500)] rounded-lg px-4 py-3 text-body-s font-semibold"
            >
              확인
            </AlertDialogAction>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
