'use client';

import { Separator } from '@/components/ui/separator';
import LoadMoreButton from '@/components/ui/load-more-button';
import { LoadingState } from '@/components/loading-state';
import type { Inquiry } from '../_types/inquiry';
import InquiryListItem from './inquiry-list-item';

interface InquiryListProps {
  inquiries: Inquiry[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export default function InquiryList({
  inquiries,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: InquiryListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-body-s text-grayscale-gray5">등록된 질문이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-20 w-full">
      <div className="flex flex-col gap-8 w-full">
        {inquiries.map((inquiry, index) => (
          <div key={inquiry.id} className="flex flex-col gap-8">
            <InquiryListItem inquiry={inquiry} />
            {index !== inquiries.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {hasNextPage && <LoadMoreButton onClick={onLoadMore} isLoading={isFetchingNextPage} />}
    </div>
  );
}
