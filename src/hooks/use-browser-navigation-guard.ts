'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseBrowserNavigationGuardOptions {
  hasChanges: boolean | (() => boolean);
  enabled?: boolean;
}

/**
 * 브라우저 뒤로가기/앞으로가기/새로고침 시 작성 중단 확인 모달을 띄우기 위한 가드 훅
 * - 커스텀 모달은 popstate에서만 가능
 * - 새로고침/탭 닫기는 브라우저 기본 confirm만 가능 (beforeunload)
 */
export default function useBrowserNavigationGuard({ hasChanges, enabled = true }: UseBrowserNavigationGuardOptions) {
  const [showBrowserGuard, setShowBrowserGuard] = useState(false);
  const allowNavigationRef = useRef(false);

  const checkHasChanges = useCallback(
    () => (typeof hasChanges === 'function' ? hasChanges() : hasChanges),
    [hasChanges],
  );

  useEffect(() => {
    if (!enabled) return;

    // 현재 위치를 히스토리에 추가해 popstate에서 동일 위치로 복구
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      if (!checkHasChanges() || allowNavigationRef.current) return;
      event.preventDefault();
      // 이동 취소 후 모달 표시
      window.history.pushState(null, '', window.location.href);
      setShowBrowserGuard(true);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!checkHasChanges()) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [checkHasChanges, enabled]);

  const handleBrowserConfirm = () => {
    allowNavigationRef.current = true;
    setShowBrowserGuard(false);
    window.history.back();
  };

  const handleBrowserCancel = () => {
    allowNavigationRef.current = false;
    setShowBrowserGuard(false);
  };

  return {
    showBrowserGuard,
    handleBrowserConfirm,
    handleBrowserCancel,
  };
}
