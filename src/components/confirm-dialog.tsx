'use client';

import { useState, cloneElement, isValidElement } from 'react';
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
  /**
   * 다이얼로그 열림 상태 (선택적)
   */
  open?: boolean;
  /**
   * 다이얼로그 열림 상태 변경 시 호출되는 함수 (선택적)
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 확인 버튼 클릭 시 실행할 함수
   */
  onConfirm: () => void;
  /**
   * 취소 버튼 클릭 시 실행할 함수
   */
  onCancel?: () => void;
  /**
   * 다이얼로그 제목
   */
  title: string;
  /**
   * 다이얼로그 설명
   */
  description: React.ReactNode;
  /**
   * 확인 버튼 텍스트 (기본값: '확인')
   */
  confirmText?: string;
  /**
   * 취소 버튼 텍스트 (기본값: '취소')
   */
  cancelText?: string;
  /**
   * 데이터가 있는지 확인하는 함수 또는 boolean 값 (선택적)
   * 설정하면 hasData가 true일 때만 다이얼로그를 표시
   */
  hasData?: boolean | (() => boolean);
  /**
   * 다이얼로그 트리거 역할을 할 자식 요소 (선택적)
   * children의 onClick에 다이얼로그 열기 로직이 자동으로 추가됨
   */
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  hasData,
  children,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // 외부 제어 또는 내부 제어
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && controlledOnOpenChange ? controlledOnOpenChange : setInternalOpen;

  const check = () => (hasData !== undefined ? (typeof hasData === 'function' ? hasData() : hasData) : true);

  // 트리거 클릭 시 호출
  const handleTrigger = () => {
    if (check()) {
      setOpen(true);
    } else {
      // hasData가 false면 바로 confirm 실행
      onConfirm();
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  // children이 있으면 클론하여 onClick 이벤트 추가
  const triggerElement =
    children && isValidElement(children)
      ? cloneElement(
          children as React.ReactElement<{
            onClick?: (e: React.MouseEvent) => void;
          }>,
          {
            onClick: (e: React.MouseEvent) => {
              const originalOnClick = (
                children as React.ReactElement<{
                  onClick?: (e: React.MouseEvent) => void;
                }>
              ).props?.onClick;
              if (originalOnClick) {
                originalOnClick(e);
              }
              handleTrigger();
            },
          },
        )
      : children;

  return (
    <>
      {triggerElement}

      <AlertDialog open={open} onOpenChange={setOpen}>
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
    </>
  );
}
