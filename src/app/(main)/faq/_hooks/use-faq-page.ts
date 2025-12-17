'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useFaqs } from './use-faqs';
import type { FaqDto } from '@/lib/home';

type TabType = 'adopter' | 'breeder';

export function useFaqPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const faqIdFromUrl = searchParams.get('faqId');
  const userTypeFromUrl = searchParams.get('userType') as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // URL 파라미터 우선, 없으면 로그인한 사용자의 역할에 따라 초기 탭 설정
    if (userTypeFromUrl === 'breeder' || userTypeFromUrl === 'adopter') {
      return userTypeFromUrl;
    }
    return user?.role === 'breeder' ? 'breeder' : 'adopter';
  });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const { data: faqs = [], isLoading, error } = useFaqs(activeTab);

  // 로그인 상태 변경 시 탭 업데이트 (URL 파라미터가 없을 때만)
  useEffect(() => {
    if (!userTypeFromUrl) {
      if (user?.role === 'breeder') {
        setActiveTab('breeder');
      } else if (user?.role === 'adopter') {
        setActiveTab('adopter');
      }
    }
  }, [user?.role, userTypeFromUrl]);

  // URL에서 faqId가 있으면 해당 FAQ를 열기
  useEffect(() => {
    if (faqs.length > 0 && faqIdFromUrl) {
      const targetIndex = faqs.findIndex((faq) => faq.faqId === faqIdFromUrl);
      if (targetIndex !== -1) {
        setOpenIndex(targetIndex);
        // 만약 10개 이상이면 더보기 버튼을 눌러야 보이므로 showAll을 true로 설정
        if (targetIndex >= 10) {
          setShowAll(true);
        }
      } else {
        // FAQ를 찾지 못하면 첫 번째 아이템 열기
        setOpenIndex(0);
      }
    } else if (faqs.length > 0) {
      setOpenIndex(0); // 첫 번째 아이템 열기
    }
  }, [faqs, faqIdFromUrl]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => {
      // 이미 열려있는 항목을 클릭하면 변화 없음
      if (prev === index) {
        return prev;
      }

      return index;
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const displayedItems = showAll ? faqs : faqs.slice(0, 10);
  const hasMore = faqs.length > 10;

  // displayedItems의 인덱스를 실제 faqs 배열의 인덱스로 변환하는 헬퍼 함수
  const getRealIndex = (item: FaqDto): number => {
    return faqs.findIndex((faq) => faq.faqId === item.faqId);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return {
    activeTab,
    openIndex,
    showAll,
    faqs,
    displayedItems,
    hasMore,
    isLoading,
    error,
    handleToggle,
    handleTabChange,
    handleShowAll,
    getRealIndex,
  };
}
