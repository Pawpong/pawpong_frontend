'use client';

import { useEffect, useState } from 'react';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { getAdopterFaqs, getBreederFaqs, type FaqDto } from '@/lib/home';
import { useAuthStore } from '@/stores/auth-store';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';

const FAQ = () => {
  const isMd = useBreakpoint('md');
  const [faqs, setFaqs] = useState<FaqDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    // hydration이 완료될 때까지 대기
    if (!hasHydrated) return;

    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        // role에 따라 다른 FAQ 조회
        const data = user?.role === 'breeder' ? await getBreederFaqs() : await getAdopterFaqs();
        setFaqs(data);
        setError(null);
      } catch (err) {
        console.error('FAQ 조회 실패:', err);
        setError('FAQ를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, [hasHydrated, user?.role]);

  const leftColumn = faqs.slice(0, Math.ceil(faqs.length / 2));
  const rightColumn = faqs.slice(Math.ceil(faqs.length / 2));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-7">
        <BreederProfileSectionHeader>
          <BreederProfileSectionTitle>자주 묻는 질문</BreederProfileSectionTitle>
          <BreederProfileSectionMore />
        </BreederProfileSectionHeader>
        <div className="h-40 flex items-center justify-center">
          <p className="text-body-m text-gray-400">FAQ 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || faqs.length === 0) {
    return (
      <div className="flex flex-col gap-7">
        <BreederProfileSectionHeader>
          <BreederProfileSectionTitle>자주 묻는 질문</BreederProfileSectionTitle>
          <BreederProfileSectionMore />
        </BreederProfileSectionHeader>
        <div className="h-40 flex items-center justify-center">
          <p className="text-body-m text-gray-400">{error || '표시할 FAQ가 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>자주 묻는 질문</BreederProfileSectionTitle>
        <BreederProfileSectionMore />
      </BreederProfileSectionHeader>
      {/* 모바일: 모든 질문을 하나의 열로 */}
      {!isMd && (
        <div className="flex flex-col">
          {faqs.map((item) => (
            <div key={item.faqId}>
              <div className="h-px bg-[#e4e7ec] w-full" />
              <div className="py-5">
                <p className="text-body-m font-medium text-primary-500">{item.question}</p>
              </div>
            </div>
          ))}
          <div className="h-px bg-[#e4e7ec] w-full" />
        </div>
      )}

      {/* 데스크탑/패드: 2열 그리드 */}
      {isMd && (
        <div className="grid md:grid-cols-2 gap-x-6">
          {/* 왼쪽 열 */}
          <div className="flex flex-col">
            {leftColumn.map((item) => (
              <div key={item.faqId}>
                <div className="h-px bg-[#e4e7ec] w-full" />
                <div className="py-5">
                  <p className="text-body-m font-medium text-primary">{item.question}</p>
                </div>
              </div>
            ))}
            <div className="h-px bg-[#e4e7ec] w-full" />
          </div>

          {/* 오른쪽 열 */}
          <div className="flex flex-col">
            {rightColumn.map((item) => (
              <div key={item.faqId}>
                <div className="h-px bg-[#e4e7ec] w-full" />
                <div className="py-5">
                  <p className="text-body-m font-medium text-primary">{item.question}</p>
                </div>
              </div>
            ))}
            <div className="h-px bg-[#e4e7ec] w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
