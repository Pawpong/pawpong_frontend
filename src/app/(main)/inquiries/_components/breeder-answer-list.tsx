'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import LoadMoreButton from '@/components/ui/load-more-button';
import { Button } from '@/components/ui/button';
import { LoadingState, FetchErrorState } from '@/components/loading-state';
import { cn } from '@/api/utils';
import { useBreederInquiries } from '../_hooks/use-breeder-inquiries';
import BreederInquiryListItem from './breeder-inquiry-list-item';

type AnswerTab = 'unanswered' | 'answered';

const TABS: { value: AnswerTab; label: string }[] = [
  { value: 'unanswered', label: '답변 전' },
  { value: 'answered', label: '답변 완료' },
];

export default function BreederAnswerList() {
  const [activeTab, setActiveTab] = useState<AnswerTab>('unanswered');
  const answered = activeTab === 'answered';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useBreederInquiries(answered);
  const inquiries = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5 py-6">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            variant="ghost"
            className={cn(
              'h-9 px-3 py-2 rounded-lg text-primary-500',
              activeTab === tab.value
                ? 'bg-secondary-500'
                : 'bg-white border border-tertiary-600 hover:bg-tertiary-500',
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isError ? (
        <FetchErrorState message="목록을 불러오는데 실패했습니다." onRetry={() => refetch()} />
      ) : isLoading ? (
        <LoadingState />
      ) : inquiries.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-body-s text-grayscale-gray5">
            {answered ? '완료된 답변이 없습니다.' : '답변할 질문이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-20 w-full">
          <div className="flex flex-col gap-8 w-full">
            {inquiries.map((inquiry, index) => (
              <div key={inquiry.id} className="flex flex-col gap-8">
                <BreederInquiryListItem inquiry={inquiry} answered={answered} />
                {index !== inquiries.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {hasNextPage && <LoadMoreButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} />}
        </div>
      )}
    </div>
  );
}
