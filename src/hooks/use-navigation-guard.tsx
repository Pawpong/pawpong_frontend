"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface UseNavigationGuardOptions {
  /**
   * 데이터가 있는지 확인하는 함수 또는 boolean 값
   */
  hasData: boolean | (() => boolean);
  /**
   * 취소 시 실행할 함수
   */
  onCancel?: () => void;
}

/**
 * 페이지 이탈 시 네비게이션 가드를 제공하는 커스텀 훅
 * guardNavigation 함수를 호출하여 네비게이션을 가드할 수 있음
 */
export default function useNavigationGuard({
  hasData,
  onCancel,
}: UseNavigationGuardOptions) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  const checkHasData = useCallback(
    () => (typeof hasData === "function" ? hasData() : hasData),
    [hasData]
  );

  // 사용자가 이동을 시도할 때 호출하는 함수
  const guardNavigation = useCallback(
    (href: string) => {
      if (checkHasData()) {
        setShowDialog(true);
        setNextPath(href);
      } else {
        router.push(href);
      }
    },
    [checkHasData, router]
  );

  const confirmNavigation = useCallback(() => {
    if (nextPath) router.push(nextPath);
    setShowDialog(false);
    setNextPath(null);
  }, [nextPath, router]);

  const cancelNavigation = useCallback(() => {
    setShowDialog(false);
    setNextPath(null);
    onCancel?.();
  }, [onCancel]);

  return {
    showDialog,
    guardNavigation,
    confirmNavigation,
    cancelNavigation,
  };
}
