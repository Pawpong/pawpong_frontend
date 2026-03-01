'use client';

import { Separator } from '@/components/ui/separator';
import LoadMoreButton from '@/components/ui/load-more-button';
import { LoadingState } from '@/components/loading-state';
import { useMyInquiries } from '../_hooks/use-my-inquiries';
import InquiryListItem from './inquiry-list-item';
import InquiryWriteButton from './inquiry-write-button';

export default function MyInquiryList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMyInquiries();
  const inquiries = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-6">
        <p className="text-body-xs font-medium text-grayscale-gray5">
          제목은 답변을 받기에 적절한 내용으로 일부 수정될 수 있습니다.
        </p>
        <InquiryWriteButton variant="secondary" />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : inquiries.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-body-s text-grayscale-gray5">작성한 질문이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-20 w-full">
          <div className="flex flex-col gap-8 w-full">
            {inquiries.map((inquiry, index) => (
              <div key={inquiry.id} className="flex flex-col gap-8">
                <InquiryListItem inquiry={inquiry} />
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
