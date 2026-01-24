'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
import SmallDot from '@/assets/icons/small-dot.svg';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProfileImageWithBadge from '@/components/breeder/profile-image-with-badge';
import BreederInfo from '@/components/breeder/breeder-info';
import RightArrow from '@/assets/icons/right-arrow.svg';
import Close from '@/assets/icons/close';
import Arrow from '@/assets/icons/arrow';
import { cn } from '@/api/utils';
import ReviewWriteDialog from './review-write-dialog';
import { getApplicationDetail, type ApplicationDetailDto } from '@/api/application';

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
  const [applicationData, setApplicationData] = useState<ApplicationDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 다이얼로그가 열릴 때 신청 데이터 조회
  useEffect(() => {
    if (open && applicationId) {
      setIsLoading(true);
      getApplicationDetail(applicationId)
        .then((data) => {
          setApplicationData(data);
        })
        .catch((error) => {
          console.error('Failed to fetch application detail:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, applicationId]);

  const handleReviewWriteClick = () => {
    setOpen(false); // 첫 번째 다이얼로그 닫기
    setShowReviewWriteDialog(true); // 두 번째 다이얼로그 열기
  };

  // 신청 데이터에서 표준 응답 추출
  const formData = applicationData?.standardResponses;

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
                <BreederInfo
                  breederName={breederName}
                  applicationDate={applicationDate}
                  className="gap-3"
                />
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
                <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
              </div>
            )}

            {/* 폼 내용 */}
            {!isLoading && formData && (
              <div className="flex flex-col gap-12 md:gap-8 w-full">
                {/* 개인정보 동의 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?
                  </h2>
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="bg-white flex gap-2 h-12 items-center px-4 py-2 rounded-lg cursor-pointer">
                      <Checkbox checked={formData?.privacyConsent || false} disabled />
                      <span className="text-body-s font-medium text-grayscale-gray6">동의합니다</span>
                    </label>
                    <div className="flex flex-col gap-2 pl-1.5">
                      <div className="flex gap-1 items-start">
                        <SmallDot />
                        <p className="text-caption font-medium text-grayscale-gray5">
                          수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등
                        </p>
                      </div>
                      <div className="flex gap-1 items-start">
                        <SmallDot />
                        <p className="text-caption font-medium text-grayscale-gray5">
                          수집 및 이용 목적: 입양자 상담 및 검토
                        </p>
                      </div>
                      <div className="flex gap-1 items-start">
                        <SmallDot />
                        <p className="text-caption font-medium text-grayscale-gray5">
                          보유 및 이용기간: 상담 또는 입양 직후 폐기
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="h-px bg-grayscale-gray2 w-full my-7" />

                {/* 자기소개 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    간단하게 자기소개 부탁드려요.
                  </h2>
                  <Textarea
                    value={formData?.selfIntroduction || ''}
                    readOnly
                    placeholder="성별, 연령대, 거주지, 결혼 계획, 생활 패턴 등"
                    maxLength={800}
                    showLength={(formData?.selfIntroduction || '').length > 0}
                    currentLength={(formData?.selfIntroduction || '').length}
                  />
                </div>

                {/* 가족 구성원 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    함께 거주하는 가족 구성원을 알려주세요.
                  </h2>
                  <Input
                    value={formData?.familyMembers || ''}
                    readOnly
                    placeholder="인원 수, 관계, 연령대 등"
                    className="h-12"
                  />
                </div>

                {/* 가족 동의 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    모든 가족 구성원들이 입양에 동의하셨나요?
                  </h2>
                  <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                    <Checkbox checked={formData?.allFamilyConsent || false} disabled />
                    <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                  </label>
                </div>

                {/* 알러지 검사 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?
                  </h2>
                  <Input
                    value={formData?.allergyTestInfo || ''}
                    readOnly
                    placeholder="알러지 검사 여부와 결과(유무), 혹은 향후 계획"
                    className="h-12"
                  />
                </div>

                {/* 구분선 */}
                <div className="h-px bg-grayscale-gray2 w-full my-7" />

                {/* 생활 패턴 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    평균적으로 집을 비우는 시간은 얼마나 되나요?
                  </h2>
                  <Input
                    value={formData?.timeAwayFromHome || ''}
                    readOnly
                    placeholder="출퇴근·외출 시간을 포함해 하루 중 집을 비우는 시간"
                    className="h-12"
                  />
                </div>

                {/* 생활 공간 */}
                <div className="flex flex-col gap-2.5 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    아이와 함께 지내게 될 공간을 소개해 주세요.
                  </h2>
                  <div className="w-full">
                    <Textarea
                      value={formData?.livingSpaceDescription || ''}
                      readOnly
                      placeholder="반려동물이 주로 생활할 공간(예: 거실 등)과 환경(크기, 구조 등)"
                      maxLength={800}
                      showLength={(formData?.livingSpaceDescription || '').length > 0}
                      currentLength={(formData?.livingSpaceDescription || '').length}
                    />
                    <p className="text-caption font-medium text-grayscale-gray5 mt-2.5">
                      아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요
                    </p>
                  </div>
                </div>

                {/* 이전 반려동물 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    현재 함께하는, 또는 이전에 함께했던 반려동물에 대해 알려주세요.
                  </h2>
                  <Textarea
                    value={formData?.previousPetExperience || ''}
                    readOnly
                    placeholder="반려동물의 품종, 성격, 함께한 기간, 이별 사유 등"
                    maxLength={800}
                    showLength={(formData?.previousPetExperience || '').length > 0}
                    currentLength={(formData?.previousPetExperience || '').length}
                  />
                </div>

                {/* 구분선 */}
                <div className="h-px bg-grayscale-gray2 w-full my-7" />

                {/* 케어 관련 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?
                  </h2>
                  <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                    <Checkbox checked={formData?.canProvideBasicCare || false} disabled />
                    <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                  </label>
                </div>

                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?
                  </h2>
                  <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                    <Checkbox checked={formData?.canAffordMedicalExpenses || false} disabled />
                    <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                  </label>
                </div>

                {/* 구분선 */}
                <div className="h-px bg-grayscale-gray2 w-full my-7" />

                {/* 선택 사항 섹션 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    마음에 두신 아이가 있으신가요?
                  </h2>
                  <Button
                    variant="input"
                    size={undefined}
                    className="!px-[var(--space-16)] !py-[var(--space-12)] w-full group"
                    disabled
                  >
                    <span
                      className={cn(
                        'text-body-s font-medium',
                        formData?.preferredPetDescription ? 'text-[#4F3B2E]' : 'text-grayscale-gray5',
                      )}
                    >
                      {formData?.preferredPetDescription || '분양 중인 아이'}
                    </span>
                    <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                  </Button>
                </div>

                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    원하시는 입양 시기가 있나요?
                  </h2>
                  <Input value={formData?.desiredAdoptionTiming || ''} readOnly className="h-12" />
                </div>

                {/* 구분선 */}
                <div className="h-px bg-grayscale-gray2 w-full my-7" />

                {/* 마지막 메시지 */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                    마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?
                  </h2>
                  <Textarea
                    value={formData?.additionalNotes || ''}
                    readOnly
                    maxLength={800}
                    showLength={(formData?.additionalNotes || '').length > 0}
                    currentLength={(formData?.additionalNotes || '').length}
                  />
                </div>
              </div>
            )}

            {/* 데이터 없음 */}
            {!isLoading && !formData && (
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
