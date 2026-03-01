'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/ui/container';
import { AnimalTabBar, type AnimalType } from '@/components/animal-tab-bar';
import InquirySortBar from './inquiry-sort-bar';
import InquiryList from './inquiry-list';
import { useInquiries } from '../_hooks/use-inquiries';
import type { InquirySortType } from '../_types/inquiry';

/**
 * 질문 목록 기본 탭 전용 컴포넌트.
 * tab=my / tab=breeder가 아닐 때만 마운트되어 useInquiries 호출을 해당 탭으로 제한합니다.
 */
export default function DefaultInquiryTab() {
  const searchParams = useSearchParams();
  const animal = (searchParams.get('animal') as AnimalType) || 'dog';
  const [sort, setSort] = useState<InquirySortType>('latest_answer');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInquiries(animal, sort);
  const allInquiries = data?.pages.flatMap((page) => page.data) ?? [];

  const getHref = useCallback((a: AnimalType) => `/inquiries?animal=${a}`, []);

  const handleSortChange = (newSort: InquirySortType) => {
    setSort(newSort);
  };

  return (
    <Container className="pb-20">
      <div className="flex flex-col">
        <div className="pt-6 md:pt-7 lg:pt-10">
          <AnimalTabBar activeAnimal={animal} getHref={getHref} />
        </div>

        <div className="py-6">
          <InquirySortBar currentSort={sort} onSortChange={handleSortChange} />
        </div>

        <InquiryList
          inquiries={allInquiries}
          isLoading={isLoading}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </Container>
  );
}
