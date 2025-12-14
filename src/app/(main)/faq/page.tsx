'use client';

import Container from '@/components/ui/container';
import FaqItemComponent from './_components/faq-item';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import DownArrow from '@/assets/icons/long-down-arrow.svg';
import { Button } from '@/components/ui/button';
import { useFaqs } from './_hooks/use-faqs';
import { useAuthStore } from '@/stores/auth-store';

type TabType = 'adopter' | 'breeder';

export default function FaqPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // 로그인한 사용자의 역할에 따라 초기 탭 설정
    return user?.role === 'breeder' ? 'breeder' : 'adopter';
  });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const { data: faqs = [], isLoading, error } = useFaqs(activeTab);

  // 로그인 상태 변경 시 탭 업데이트
  useEffect(() => {
    if (user?.role === 'breeder') {
      setActiveTab('breeder');
    } else if (user?.role === 'adopter') {
      setActiveTab('adopter');
    }
  }, [user?.role]);

  useEffect(() => {
    if (faqs.length > 0) {
      setOpenIndex(0); // 첫 번째 아이템 열기
    }
  }, [faqs.length]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => {
      // 이미 열려있는 항목을 클릭하면 변화 없음
      if (prev === index) {
        return prev;
      }

      return index;
    });
  };

  const displayedItems = showAll ? faqs : faqs.slice(0, 10);
  const hasMore = faqs.length > 10;

  // 탭 변경 시 첫 번째 아이템 열기
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  return (
    <Container className="pt-10 pb-20 px-5 md:px-12">
      <div className="max-w-[1344px] w-full mx-auto flex flex-col gap-7">
        {/* 제목 및 탭 */}
        <div className="flex flex-col gap-6">
          <h1 className="text-heading-3 font-semibold text-primary">자주 묻는 질문</h1>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleTabChange('adopter')}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-lg text-body-xs font-medium transition-colors',
                activeTab === 'adopter'
                  ? 'bg-[#A0C8F4] text-primary'
                  : 'bg-white border border-[#EEEBDE] text-primary hover:bg-[var(--color-tertiary-500)]',
              )}
            >
              일반 회원
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('breeder')}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-lg text-body-xs font-medium transition-colors',
                activeTab === 'breeder'
                  ? 'bg-[#A0C8F4] text-primary'
                  : 'bg-white border border-[#EEEBDE] text-primary hover:bg-[var(--color-tertiary-500)]',
              )}
            >
              브리더 회원
            </button>
          </div>
        </div>

        {/* FAQ 리스트 */}
        <div className="flex flex-col items-center gap-20">
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-20">
              <p className="text-body-m text-grayscale-gray5">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="w-full flex items-center justify-center py-20">
              <p className="text-body-m text-grayscale-gray5">FAQ를 불러오는데 실패했습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {displayedItems.map((item, index) => (
                <FaqItemComponent
                  key={`${activeTab}-${item.faqId}-${index}`}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          )}

          {/* 더보기 버튼 */}
          {hasMore && !showAll && (
            <Button
              variant="ghost"
              onClick={() => setShowAll(true)}
              className="bg-[#F5F5F5] hover:bg-[#F5F5F5] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3"
            >
              <span className="text-body-s font-medium text-grayscale-gray6">더보기</span>
              <DownArrow />
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
