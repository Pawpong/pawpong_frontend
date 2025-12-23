'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
 * - 브라우저 뒤로가기/앞으로가기 가드
 * - 브라우저 새로고침/탭 닫기 가드
 */
export default function useFormGuard({ hasChanges, onCancel }: UseFormGuardOptions) {
  const router = useRouter();
  const [isBackNavigation, setIsBackNavigation] = useState(false);

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

  // 브라우저 뒤로가기 확인 핸들러
  const handleBackNavigationConfirm = () => {
    setIsBackNavigation(false);
    router.back();
  };

  const handleBackNavigationCancel = () => {
    setIsBackNavigation(false);
  };

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

  // 브라우저 새로고침/탭 닫기 방지
  useEffect(() => {
    if (!checkHasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [checkHasChanges]);

  // 브라우저 뒤로가기/앞으로가기 방지
  useEffect(() => {
    const currentHasChanges = typeof hasChanges === 'function' ? hasChanges() : hasChanges;

    if (!currentHasChanges) {
      // 변경사항이 없으면 history 상태 정리
      setIsBackNavigation(false);
      return;
    }

    // 변경사항이 있을 때 현재 상태를 history에 추가하여 뒤로가기 감지 가능하게 함
    window.history.pushState({ preventBack: true }, '', window.location.href);

    const handlePopState = () => {
      // 현재 변경사항 상태 확인
      const stillHasChanges = typeof hasChanges === 'function' ? hasChanges() : hasChanges;
      // 변경사항이 있고 다이얼로그가 표시되지 않았으면
      if (stillHasChanges && !showNavigationDialog && !isBackNavigation) {
        // 뒤로가기를 취소하기 위해 다시 현재 상태를 history에 추가
        window.history.pushState({ preventBack: true }, '', window.location.href);
        // 브라우저 뒤로가기 다이얼로그 표시
        setIsBackNavigation(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasChanges, showNavigationDialog, isBackNavigation]);

  return {
    // 네비게이션 링크 클릭 관련
    showNavigationDialog,
    handleNavigationConfirm,
    handleNavigationCancel,
    // 브라우저 뒤로가기 관련
    isBackNavigation,
    handleBackNavigationConfirm,
    handleBackNavigationCancel,
  };
}
