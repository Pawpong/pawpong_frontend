'use client';

import { useState } from 'react';
import SirenMuted from '@/assets/icons/siren-muted.svg';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import ReportDialog from '@/components/report-dialog/report-dialog';
import Image from 'next/image';

interface ReviewData {
  id: string;
  nickname: string;
  date: string;
  content: string;
  reviewType?: string;
  replyContent?: string | null;
  replyWrittenAt?: string | null;
  replyUpdatedAt?: string | null;
  breederNickname?: string;
  breederProfileImage?: string | null;
  breedingPetType?: string;
}

export default function Review({ data }: { data: ReviewData }) {
  const isMobile = !useBreakpoint('md');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const typeLabel = data.reviewType || '후기';

  // 날짜 포맷팅
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  };

  const replyDate = data.replyUpdatedAt || data.replyWrittenAt;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-body-s font-semibold text-grayscale-gray5">{data.nickname}</div>
            {!isMobile && (
              <div className="text-body-s text-grayscale-gray5">
                {typeLabel}・{data.date}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="gap-1 text-grayscale-gray5 text-body-xs px-0 has-[>svg]:px-0"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <SirenMuted className="size-5" />
            <div>신고하기</div>
          </Button>
        </div>
        {isMobile && (
          <div className="text-body-s text-grayscale-gray5">
            {typeLabel}・{data.date}
          </div>
        )}
        <div className="font-medium text-body-m text-primary-500 break-all">{data.content}</div>

        {/* 브리더 답글 표시 */}
        {data.replyContent && (
          <div className="mt-2">
            <div className="flex gap-3">
              {/* 브리더 프로필 이미지 */}
              <div className="w-10 h-10 rounded-lg bg-grayscale-gray1 flex items-center justify-center shrink-0 overflow-hidden">
                {data.breederProfileImage ? (
                  <Image
                    src={data.breederProfileImage}
                    alt={data.breederNickname || '브리더'}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized={data.breederProfileImage.startsWith('http')}
                  />
                ) : (
                  (() => {
                    const petType = data.breedingPetType?.toLowerCase();
                    const IconComponent = petType === 'cat' ? Cat : Dog;
                    return <IconComponent className="w-6 h-6 text-grayscale-gray5" />;
                  })()
                )}
              </div>
              {/* 답글 내용 */}
              <div className="flex-1 bg-grayscale-gray1 rounded-lg p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-body-m font-semibold text-primary-500">{data.breederNickname}</span>
                  <span className="text-body-s text-grayscale-gray5">{formatDate(replyDate)}</span>
                </div>
                <div className="text-body-m font-medium text-primary-500 break-all">{data.replyContent}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReportDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen} type="review" reviewId={data.id} />
    </>
  );
}
