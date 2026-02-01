'use client';

import { useEffect } from 'react';

import { useNavigationGuardContext } from '@/contexts/navigation-guard-context';
import useBrowserNavigationGuard from '@/hooks/use-browser-navigation-guard';
import useNavigationGuard from '@/hooks/use-navigation-guard';

export function useCounselGuard(hasFormData: boolean) {
  const {
    showDialog: showNavigationDialog,
    guardNavigation,
    confirmNavigation: handleNavigationConfirm,
    cancelNavigation: handleNavigationCancel,
  } = useNavigationGuard({
    hasData: hasFormData,
  });

  const { showBrowserGuard, handleBrowserConfirm, handleBrowserCancel } = useBrowserNavigationGuard({
    hasChanges: hasFormData,
  });

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
    showNavigationDialog,
    handleNavigationConfirm,
    handleNavigationCancel,
    showBrowserGuard,
    handleBrowserConfirm,
    handleBrowserCancel,
  };
}
