'use client';

import { useRouter } from 'next/navigation';
import ConfirmDialog from './confirm-dialog';

interface ExitConfirmDialogProps {
  /**
   * 데이터가 있는지 확인하는 함수 또는 boolean 값
   */
  hasData: boolean | (() => boolean);
  /**
   * 확인 시 실행할 함수 (기본값: router.push('/'))
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
 * ConfirmDialog를 래핑하여 이탈 확인 전용 텍스트를 제공합니다.
 */
export default function ExitConfirmDialog({
  hasData,
  onConfirm,
  onCancel,
  children,
  open,
  onOpenChange,
}: ExitConfirmDialogProps) {
  const router = useRouter();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      router.push('/');
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      hasData={hasData}
      title="입력한 내용이 사라져요!"
      description={`지금 화면을 벗어나면
입력한 내용이 사라지며, 복구할 수 없어요.`}
      confirmText="작성 중단"
      cancelText="이어서 작성"
    >
      {children}
    </ConfirmDialog>
  );
}
