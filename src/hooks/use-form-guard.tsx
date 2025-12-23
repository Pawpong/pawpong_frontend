'use client';

import { useEffect } from 'react';
import useNavigationGuard from './use-navigation-guard';
import { useNavigationGuardContext } from '@/contexts/navigation-guard-context';

interface UseFormGuardOptions {
  /**
   * 변경사항이 있는지 확인하는 함수 또는 boolean 값
   */
  hasChanges: boolean | (() => boolean);
  /**
   * 취소 시 실행할 함수
   */
  onCancel?: () => void;
}

/**
 * 폼 페이지에서 네비게이션 가드를 제공하는 커스텀 훅
 * - 네비게이션 바 링크 클릭 가드
 * - 로고 클릭 가드
 */
export default function useFormGuard({ hasChanges, onCancel }: UseFormGuardOptions) {
  // 변경사항 확인 함수
  const checkHasChanges = typeof hasChanges === 'function' ? hasChanges() : hasChanges;

  // 네비게이션 가드 훅 사용
  const {
    showDialog: showNavigationDialog,
    guardNavigation,
    confirmNavigation: handleNavigationConfirm,
    cancelNavigation: handleNavigationCancel,
  } = useNavigationGuard({
    hasData: checkHasChanges,
    onCancel,
  });

  // Context에 guardNavigation 등록
  const { setGuardNavigation } = useNavigationGuardContext() || {};
  useEffect(() => {
    if (setGuardNavigation) {
      setGuardNavigation(guardNavigation);
    }
    return () => {
      if (setGuardNavigation) {
        setGuardNavigation(undefined);
      }
    };
  }, [guardNavigation, setGuardNavigation]);

  return {
    // 네비게이션 링크 클릭 관련
    showNavigationDialog,
    handleNavigationConfirm,
    handleNavigationCancel,
  };
}
