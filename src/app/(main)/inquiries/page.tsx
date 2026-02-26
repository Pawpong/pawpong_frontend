'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/ui/container';
import { AnimalTabBar, type AnimalType } from '@/components/animal-tab-bar';
import InquirySortBar from './_components/inquiry-sort-bar';
import InquiryList from './_components/inquiry-list';
import { useInquiries } from './_hooks/use-inquiries';
import type { InquirySortType } from './_types/inquiry';

export default function InquiriesPage() {
  const router = useRouter();
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
