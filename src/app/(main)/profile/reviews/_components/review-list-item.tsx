'use client';

import { type MyReviewItemDto } from '@/app/api/breeder-management';

interface ReviewListItemProps {
  review: MyReviewItemDto;
}

export default function ReviewListItem({ review }: ReviewListItemProps) {
  // 날짜 포맷팅
  let formattedDate = '';
  if (review.createdAt) {
    try {
      const date = new Date(review.createdAt);
      formattedDate = date.toLocaleDateString('ko-KR');
    } catch {
      formattedDate = '날짜 없음';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-body-s font-semibold text-grayscale-gray5">
            {review.adopterName || '익명'}
          </div>
          <div className="text-body-s text-grayscale-gray5">
            {formattedDate || '날짜 없음'}
          </div>
        </div>
        {review.isReported && (
          <div className="text-body-xs text-status-error-500">신고됨</div>
        )}
      </div>
      <div className="font-medium text-body-m text-primary-500 break-all">{review.comment}</div>
      {review.petName && (
        <div className="text-body-s text-grayscale-gray5">관련 반려동물: {review.petName}</div>
      )}
    </div>
  );
}
