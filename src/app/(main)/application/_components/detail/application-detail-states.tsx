'use client';

import { LoadingText } from '@/components/loading-state';

interface ApplicationDetailStatesProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  loadingMessage?: string;
}

/**
 * 신청 상세 모달의 로딩/에러 상태 UI 공통 컴포넌트
 */
export function ApplicationDetailStates({
  isLoading,
  isError,
  errorMessage = '신청 정보를 찾을 수 없습니다.',
  loadingMessage,
}: ApplicationDetailStatesProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10 flex-1">
        <LoadingText className={loadingMessage ? `text-body-m text-grayscale-gray5` : undefined} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-10 flex-1">
        <p className="text-body-m text-grayscale-gray5">{errorMessage}</p>
      </div>
    );
  }

  return null;
}
