'use client';

import { useState, cloneElement, isValidElement } from 'react';
import { useRouter } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import ErrorIcon from '@/assets/icons/error';

interface ExitConfirmDialogProps {
  /**
   * 데이터가 있는지 확인하는 함수 또는 boolean 값
   */
  hasData: boolean | (() => boolean);
  /**
   * 확인 시 실행할 함수 (기본값: router.back())
   */
  onConfirm?: () => void;
  /**
   * 취소 시 실행할 함수
   */
  onCancel?: () => void;
  /**
   * 뒤로가기 버튼 트리거 (children으로 전달, 선택적)
   */
  children?: React.ReactNode;
  /**
   * 외부에서 다이얼로그 열림 상태를 제어 (선택적)
   */
  open?: boolean;
  /**
   * 외부에서 다이얼로그 열림 상태 변경 시 호출되는 함수 (선택적)
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 페이지 이탈 시 확인 다이얼로그를 표시하는 재사용 가능한 컴포넌트
 */
export default function ExitConfirmDialog({
  hasData,
  onConfirm,
  onCancel,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ExitConfirmDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  // 외부 제어 또는 내부 제어
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled && controlledOnOpenChange ? controlledOnOpenChange : setInternalOpen;

  const check = () => (typeof hasData === 'function' ? hasData() : hasData);

  // 페이지 이동 시 호출 (예: 뒤로가기 버튼, router.push)
  const handleExit = () => {
    if (check()) {
      setOpen(true);
    } else {
      if (onConfirm) {
        onConfirm();
      } else {
        router.back();
      }
    }
  };

  const confirm = () => {
    setOpen(false);
    if (onConfirm) {
      onConfirm();
    } else {
      router.push('/');
    }
  };

  const cancel = () => {
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
              handleExit();
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
                  입력한 내용이 사라져요!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-body-s font-normal leading-[24px] text-grayscale-gray6 mt-0">
                  지금 화면을 벗어나면
                  <br />
                  입력한 내용이 사라지며, 복구할 수 없어요.
                </AlertDialogDescription>
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex flex-col gap-3 items-center justify-end pb-5 pt-4 px-4">
              <div className="flex gap-2 w-full">
                <AlertDialogCancel
                  onClick={cancel}
                  className="flex-1 h-12 bg-[var(--color-secondary-100)] text-[#4F3B2E] rounded-lg px-4 py-3 text-body-s font-semibold border-0"
                >
                  이어서 작성
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirm}
                  className="flex-1 h-12 bg-[#4F3B2E] text-[var(--color-secondary-500)] hover:bg-[#4F3B2E] hover:text-[var(--color-secondary-500)] rounded-lg px-4 py-3 text-body-s font-semibold"
                >
                  작성 중단
                </AlertDialogAction>
              </div>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
}
