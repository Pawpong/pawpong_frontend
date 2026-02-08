'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import RightArrow from '@/assets/icons/right-arrow.svg';
import Close from '@/assets/icons/close';
import ReviewWriteDialog from './review-write-dialog';
import { getApplicationDetail, type ApplicationDetailDto } from '@/api/application';
import { getAdopterProfile } from '@/api/adopter';
import { LoadingText } from '@/components/loading-state';
import { CounselSection } from '@/app/(main)/counselform/_components/shared/counsel-section';
import { COUNSEL_SECTIONS } from '@/app/(main)/counselform/_constants/counsel-questions.constants';
import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';
import { formatPhoneNumber } from '@/utils/phone';

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
  const router = useRouter();
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
    isError: isProfileError,
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
      ? {
          privacyAgreement: applicationData.standardResponses?.privacyConsent ?? false,
          name: adopterProfile?.nickname || '',
          phone: adopterProfile?.phoneNumber || '',
          email: adopterProfile?.emailAddress || '',
          introduction: applicationData.standardResponses?.selfIntroduction || '',
          familyMembers: applicationData.standardResponses?.familyMembers || '',
          familyAgreement: applicationData.standardResponses?.allFamilyConsent ?? false,
          allergyCheck: applicationData.standardResponses?.allergyTestInfo || '',
          awayTime: applicationData.standardResponses?.timeAwayFromHome || '',
          livingSpace: applicationData.standardResponses?.livingSpaceDescription || '',
          previousPets: applicationData.standardResponses?.previousPetExperience || '',
          basicCare: applicationData.standardResponses?.canProvideBasicCare ?? false,
          medicalExpense: applicationData.standardResponses?.canAffordMedicalExpenses ?? false,
          interestedAnimal: applicationData.standardResponses?.preferredPetDescription
            ? applicationData.standardResponses.preferredPetDescription.split('/')
            : [],
          interestedAnimalDetails: '',
          adoptionTiming: applicationData.standardResponses?.desiredAdoptionTiming || '',
          additionalMessage: applicationData.standardResponses?.additionalNotes || '',
        }
      : null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="w-full h-full lg:w-[37.5rem] lg:h-[37.5rem] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:top-[50%] lg:left-[50%] top-0 left-0 translate-x-0 translate-y-0 rounded-none lg:rounded-2xl border-none overflow-hidden flex flex-col p-0 gap-0"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>신청 내역 상세</DialogTitle>
          </VisuallyHidden>
          {/* 헤더 */}
          <div className="flex flex-col gap-[10px] items-start pt-6 px-6 pb-[10px] shrink-0">
            <div className="flex gap-1 items-center justify-end w-full">
              <DialogClose asChild>
                <Button variant="secondary" size="icon">
                  <Close className="size-7" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-9 flex-1 min-h-0 overflow-y-auto pl-6 pr-6 pt-6 pb-10">
            {/* 브리더 정보 - 전체 클릭 시 브리더 페이지로 이동 */}
            <div
              className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              onClick={() => {
                setOpen(false);
                router.push(`/explore/breeder/${breederId}`);
              }}
            >
              <div className="flex gap-5 items-center grow">
                <ProfileImageWithBadge src={profileImage} alt={breederName} animalType={animalType} size={68} />
                <BreederInfo breederName={breederName} applicationDate={applicationDate} className="gap-3" />
              </div>
              <Button
                className="gap-1 text-grayscale-gray5 text-body-xs h-auto p-0 has-[>svg]:px-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  router.push(`/explore/breeder/${breederId}`);
                }}
              >
                <span>보기</span>
                <RightArrow className="size-5" />
              </Button>
            </div>

            {/* 구분선 */}
            <div className="w-full flex flex-col shrink-0">
              <div className="h-px bg-grayscale-gray2 w-full" />
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="flex justify-center py-10 flex-1">
                <LoadingText />
              </div>
            )}

            {/* 에러 상태 - 신청 데이터 조회 실패 */}
            {!isLoading && isApplicationError && (
              <div className="flex justify-center py-10 flex-1">
                <p className="text-body-s text-grayscale-gray5">신청 내역을 불러올 수 없습니다.</p>
                      </div>
            )}

            {/* 폼 내용 - 신청 데이터가 있고 에러가 없을 때만 표시 */}
            {!isLoading && !isApplicationError && formData && (
              <div className="flex flex-col w-full">
                {COUNSEL_SECTIONS.map((section, index) => {
                  const isLast = index === COUNSEL_SECTIONS.length - 1;
                  return (
                    <div key={section.sectionId}>
                      <CounselSection
                        section={section}
                        mode="readonly"
                        formData={formData}
                        onFormatPhone={formatPhoneNumber}
                        readonlyVariant="white"
                      />
                      {!isLast && <div className="h-px bg-grayscale-gray2 w-full my-7" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 데이터 없음 - 로딩도 에러도 아닌데 데이터가 없을 때 */}
            {!isLoading && !isApplicationError && !formData && (
              <div className="flex justify-center py-10 flex-1">
                <p className="text-body-s text-grayscale-gray5">신청 내역을 불러올 수 없습니다.</p>
              </div>
            )}
          </div>

          {/* 구분선 - 항상 표시 (레이아웃 일관성 유지) */}
          <div className="h-px bg-grayscale-gray2 w-full shrink-0" />

          {/* 하단 버튼 - 후기 작성 가능할 때만 내용 표시, 그렇지 않으면 빈 공간 */}
          <div className="bg-white flex gap-2.5 items-start justify-end overflow-clip pb-6 pt-4 px-6 shrink-0">
            {canWriteReview && (
              <Button variant="primary" onClick={handleReviewWriteClick}>
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
