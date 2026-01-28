'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/api/utils';
import ErrorIcon from '@/assets/icons/error';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}


export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="bg-[var(--color-alpha-dimmer)]" />
        <AlertDialogPrimitive.Content
          className={cn(
            'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 flex flex-col w-full max-w-[360px] translate-x-[-50%] translate-y-[-50%] rounded-[16px] shadow-lg duration-200 overflow-hidden',
          )}
        >
          {/* 상단 영역 */}
          <div className="flex flex-col gap-3 items-center pb-4 pt-8 px-4">
            {/* 경고 아이콘 */}
            <div className="relative size-[60px] flex items-center justify-center">
              <div className="absolute size-[53.33px] bg-[var(--color-status-error-100)] rounded-full" />
              <div className="absolute size-[26.67px] flex items-center justify-center">
                <ErrorIcon className="size-full" />
              </div>
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-col gap-1.5 items-center text-center w-full">
              <AlertDialogTitle className="text-body-l font-semibold leading-[32px] text-grayscale-black mb-0">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-body-s font-normal leading-[24px] text-grayscale-gray6 mt-0 whitespace-pre-line">
                {description}
              </AlertDialogDescription>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex flex-col gap-3 items-center justify-end pb-5 pt-4 px-4">
            <div className="flex gap-2 w-full">
              <AlertDialogCancel
                onClick={handleCancel}
                className="flex-1 h-12 bg-[var(--color-secondary-100)] text-[#4F3B2E] rounded-lg px-4 py-3 text-body-s font-semibold border-0"
              >
                {cancelText}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="flex-1 h-12 bg-[#4F3B2E] text-[var(--color-secondary-500)] hover:bg-[#4F3B2E] hover:text-[var(--color-secondary-500)] rounded-lg px-4 py-3 text-body-s font-semibold"
              >
                {confirmText}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
