'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import ReviewWriteDialog from './review-write-dialog';
import { getApplicationDetail } from '@/api/application';
import { getAdopterProfile } from '@/api/adopter';
import { Separator } from '@/components/ui/separator';
import { ApplicationDetailContent } from '../detail/application-detail-content';
import { ApplicationDetailStates } from '../detail/application-detail-states';
import BreederSummary from '../shared/breeder-summary';
import { mapToCounselFormData } from '../../_utils/form-data-mapper';
import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';

interface ReviewDialogProps {
  applicationId: string;
  breederId: string;
  breederName: string;
  applicationDate: string;
  profileImage: string;
  animalType: 'cat' | 'dog';
  canWriteReview?: boolean;
  children: React.ReactNode;
}

export default function ReviewDialog({
  applicationId,
  breederId,
  breederName,
  applicationDate,
  profileImage,
  animalType,
  canWriteReview = true,
  children,
}: ReviewDialogProps) {
  const [showReviewWriteDialog, setShowReviewWriteDialog] = useState(false);
  const [open, setOpen] = useState(false);

  // React Query로 신청 데이터 조회
  const {
    data: applicationData,
    isLoading: isApplicationLoading,
    isError: isApplicationError,
  } = useQuery({
    queryKey: ['application-detail', applicationId],
    queryFn: () => getApplicationDetail(applicationId),
    enabled: open && !!applicationId,
  });

  // React Query로 입양자 프로필 조회 (실패해도 계속 진행)
  const {
    data: adopterProfile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ['adopter-profile'],
    queryFn: () => getAdopterProfile(),
    enabled: open && !!applicationId,
    retry: false, // 프로필 조회 실패 시 재시도 안 함
    throwOnError: false, // 에러를 throw하지 않고 isError로 처리
  });

  // 전체 로딩 상태 (둘 중 하나라도 로딩 중이면 true)
  const isLoading = isApplicationLoading || isProfileLoading;

  const handleReviewWriteClick = () => {
    setOpen(false); // 첫 번째 다이얼로그 닫기
    setShowReviewWriteDialog(true); // 두 번째 다이얼로그 열기
  };

  // 신청 데이터를 CounselFormData 형식으로 변환
  // ApplicationDetailDto에는 adopterName, adopterPhone, adopterEmail이 없으므로 프로필에서 가져옴
  const formData: CounselFormData | null =
    applicationData && !isApplicationError
      ? mapToCounselFormData(applicationData, adopterProfile)
      : null;

  const dialogContentClass =
    'w-full h-full md:w-[37.5rem] md:h-[37.5rem] md:translate-x-[-50%] md:translate-y-[-50%] md:top-[50%] md:left-[50%] top-0 left-0 translate-x-0 translate-y-0 rounded-none md:rounded-2xl md:overflow-hidden border-none';

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className={`${dialogContentClass} p-0 gap-0 bg-white flex flex-col`}
        >
          <VisuallyHidden>
            <DialogTitle>신청 내역 상세</DialogTitle>
          </VisuallyHidden>

          {/* 상단 구분선 */}
          <Separator className="bg-grayscale-gray2" />

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-9 flex-1 min-h-0 overflow-y-auto px-6 py-5">
            {/* 브리더 정보 */}
            <BreederSummary
              breederId={breederId}
              breederName={breederName}
              applicationDate={applicationDate}
              profileImage={profileImage}
              animalType={animalType}
              onOpenChange={setOpen}
            />

            {/* 구분선 */}
            <Separator className="bg-grayscale-gray2" />

            <ApplicationDetailStates
              isLoading={isLoading}
              isError={isApplicationError}
              errorMessage="신청 내역을 불러올 수 없습니다."
            />

            {/* 공통 상담 내용 - 신청 데이터가 있고 에러가 없을 때만 표시 */}
            {!isLoading && !isApplicationError && formData && (
              <ApplicationDetailContent
                formData={formData}
                customResponses={applicationData?.customResponses}
              />
            )}

            {/* 데이터 없음 - 로딩도 에러도 아닌데 데이터가 없을 때 */}
            {!isLoading && !isApplicationError && !formData && (
              <div className="flex justify-center py-10 flex-1">
                <p className="text-body-s text-grayscale-gray5">신청 내역을 불러올 수 없습니다.</p>
              </div>
            )}
          </div>

          {/* 하단 구분선 */}
          <Separator className="bg-grayscale-gray2" />

          {/* 하단 버튼 - 후기 작성 가능할 때만 내용 표시, 그렇지 않으면 빈 공간 */}
          <div className="bg-white px-6 py-4 rounded-b-none md:rounded-2xl flex gap-2.5 items-start justify-end overflow-clip shrink-0">
            {canWriteReview && (
              <Button
                className="h-9 px-4 bg-[#4F3B2E] hover:bg-[#3E2F23] text-white text-sm font-medium rounded min-w-[72px] ml-auto"
                onClick={handleReviewWriteClick}
              >
                후기 작성하기
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 후기 작성 다이얼로그 */}
      <ReviewWriteDialog
        applicationId={applicationId}
        breederId={breederId}
        open={showReviewWriteDialog}
        onOpenChange={setShowReviewWriteDialog}
        breederName={breederName}
        applicationDate={applicationDate}
        profileImage={profileImage}
        animalType={animalType}
      />
    </>
  );
}
