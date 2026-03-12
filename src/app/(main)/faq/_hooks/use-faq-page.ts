'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useFaqs } from './use-faqs';

type TabType = 'adopter' | 'breeder';

export function useFaqPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const faqIdFromUrl = searchParams.get('faqId');
  const userTypeFromUrl = searchParams.get('userType') as TabType | null;

  const initialTab = useMemo<TabType>(() => {
    if (userTypeFromUrl === 'breeder' || userTypeFromUrl === 'adopter') return userTypeFromUrl;
    return user?.role === 'breeder' ? 'breeder' : 'adopter';
  }, [userTypeFromUrl, user?.role]);

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));
  const [showAll, setShowAll] = useState(false);

  const { data: faqs = [], isLoading, error } = useFaqs(activeTab);

  // 로그인 상태 변경 시 탭 업데이트 (URL 파라미터가 없을 때만)
  useEffect(() => {
    if (!userTypeFromUrl) {
      setActiveTab(user?.role === 'breeder' ? 'breeder' : 'adopter');
      setOpenIndexes(new Set([0]));
      setShowAll(false);
    }
  }, [user?.role, userTypeFromUrl]);

  // URL에서 faqId가 있으면 해당 FAQ를 열기
  useEffect(() => {
    if (faqs.length === 0) return;

    if (faqIdFromUrl) {
      const targetIndex = faqs.findIndex((faq) => faq.faqId === faqIdFromUrl);
      const index = targetIndex !== -1 ? targetIndex : 0;
      setOpenIndexes(new Set([index]));
      if (index >= 10) setShowAll(true);
    } else {
      setOpenIndexes(new Set([0]));
    }
  }, [faqs, faqIdFromUrl]);

  const handleToggle = useCallback((index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setOpenIndexes(new Set([0]));
    setShowAll(false);
  }, []);

  const displayedItems = showAll ? faqs : faqs.slice(0, 10);
  const hasMore = faqs.length > 10;

  return {
    activeTab,
    openIndexes,
    showAll,
    faqs,
    displayedItems,
    hasMore,
    isLoading,
    error,
    handleToggle,
    handleTabChange,
    handleShowAll: () => setShowAll(true),
  };
}
