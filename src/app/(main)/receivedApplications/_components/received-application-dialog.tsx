'use client';

import { useState, useEffect } from 'react';
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from '@/components/ui/large-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Close from '@/assets/icons/close';
import RequestStatusBadge from './request-status-badge';
import SmallDot from '@/assets/icons/small-dot.svg';
import ErrorIcon from '@/assets/icons/error-gray.svg';
import type { CounselFormData } from '@/stores/counsel-form-store';
import { useUpdateApplicationStatus, useApplicationDetail } from '../_hooks/use-received-applications';
import { formatPhoneNumber } from '@/utils/phone';
import { SectionHeader } from '@/app/(main)/counselform/_components/shared/section-header';
import {
  ADOPTER_AND_FAMILY_INFO,
  LIVING_ENVIRONMENT,
  CARE_RESPONSIBILITY,
  PET_SELECTION,
  BREEDER_ADDITIONAL_QUESTION,
} from '@/constants/counsel-form';

interface ReceivedApplicationDialogProps {
  id: string;
  applicantNickname: string;
  animalInfo: string;
  status: 'before' | 'done';
  applicationDate: string;
  formData?: CounselFormData | null;
  children: React.ReactNode;
}

export default function ReceivedApplicationDialog({
  id,
  applicantNickname,
  status: initialStatus,
  applicationDate,
  formData,
  children,
}: ReceivedApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'before' | 'done'>(initialStatus);
  const updateStatusMutation = useUpdateApplicationStatus();
  const { data: detailData } = useApplicationDetail(open ? id : null);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleCompleteCounsel = () => {
    updateStatusMutation.mutate(
      { id, status: 'done' },
      {
        onSuccess: () => {
          setStatus('done');
          setOpen(false);
        },
      },
    );
  };

  const handleCancelComplete = () => {
    updateStatusMutation.mutate(
      { id, status: 'before' },
      {
        onSuccess: () => {
          setStatus('before');
          setOpen(false);
        },
      },
    );
  };

  // API 응답 확인을 위한 로그
  useEffect(() => {
    if (detailData) {
      console.log('[받은 신청 상세] API 응답:', detailData);
      console.log('[받은 신청 상세] preferredPetDescription:', detailData.standardResponses?.preferredPetDescription);
    }
  }, [detailData]);

  // detailData의 standardResponses를 formData로 변환
  const actualFormData: CounselFormData | null = detailData
    ? {
        privacyAgreement: detailData.standardResponses.privacyConsent,
        name: detailData.adopterName,
        phone: detailData.adopterPhone || '',
        email: detailData.adopterEmail,
        introduction: detailData.standardResponses.selfIntroduction,
        familyMembers: detailData.standardResponses.familyMembers,
        familyAgreement: detailData.standardResponses.allFamilyConsent,
        allergyCheck: detailData.standardResponses.allergyTestInfo,
        awayTime: detailData.standardResponses.timeAwayFromHome,
        livingSpace: detailData.standardResponses.livingSpaceDescription,
        previousPets: detailData.standardResponses.previousPetExperience,
        basicCare: detailData.standardResponses.canProvideBasicCare,
        medicalExpense: detailData.standardResponses.canAffordMedicalExpenses,
        // preferredPetDescription을 interestedAnimal로 매핑
        interestedAnimal: detailData.standardResponses.preferredPetDescription
          ? detailData.standardResponses.preferredPetDescription.split('/')
          : [],
        interestedAnimalDetails: '',
        adoptionTiming: detailData.standardResponses.desiredAdoptionTiming || '',
        additionalMessage: detailData.standardResponses.additionalNotes || '',
      }
    : formData || null;

  return (
    <LargeDialog open={open} onOpenChange={setOpen}>
      <LargeDialogTrigger asChild>{children}</LargeDialogTrigger>
      <LargeDialogContent className="flex flex-col w-full h-full max-h-full md:w-[37.5rem] md:h-[37.5rem] md:max-h-[37.5rem]">
        <LargeDialogHeader className="pt-6 px-6 pb-[10px]">
          <LargeDialogTitle>
            <div className="flex justify-end items-start w-full">
              <LargeDialogClose asChild>
                <Button variant="secondary" size="icon" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="bg-[var(--color-tertiary-500)] flex flex-col gap-[32px] min-h-0 overflow-y-auto px-6 pt-5 pb-10 ">
          {/* 신청자 정보 */}
          <div className="flex flex-col gap-2">
            <span className="text-body-l font-semibold text-primary-500">{applicantNickname}</span>
            <div className="flex items-center gap-[0.625rem]">
              <RequestStatusBadge status={status} />
              <span className="text-body-s font-normal text-grayscale-gray5">{applicationDate}</span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-full flex flex-col">
            <div className="h-px bg-grayscale-gray2 w-full" />
          </div>
          {/* 개인정보 동의 섹션 */}

          <div className="flex flex-col gap-8 items-start w-full">
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?
              </h2>
              <div className="flex flex-col gap-2.5 w-full">
                <label className="bg-white flex gap-2 h-12 items-center px-4 py-2 rounded-lg cursor-pointer">
                  <Checkbox checked={actualFormData?.privacyAgreement || false} disabled />
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
            <div className="flex flex-col gap-3 w-full">
              <Input
                value={formData?.name || ''}
                readOnly
                placeholder="이름"
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              />
              <Input
                value={formData?.phone ? formatPhoneNumber(formData.phone) : ''}
                readOnly
                placeholder="휴대폰 번호"
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              />
              <Input
                value={formData?.email || ''}
                readOnly
                placeholder="이메일 주소"
                type="email"
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              />
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full" />

          {/* 자기소개 섹션 */}
          <div className="flex flex-col gap-8 items-start w-full">
            <SectionHeader title={ADOPTER_AND_FAMILY_INFO.sectionTitle} subtitle={ADOPTER_AND_FAMILY_INFO.description} />
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">간단하게 자기소개 부탁드려요.</h2>
              <Textarea
                value={formData?.introduction || ''}
                readOnly
                placeholder="성별, 연령대, 거주지, 결혼 계획, 생활 패턴 등"
                maxLength={1500}
                showLength={(formData?.introduction || '').length > 0}
                currentLength={(formData?.introduction || '').length}
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
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
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                모든 가족 구성원들이 입양에 동의하셨나요?
              </h2>
              <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox checked={formData?.familyAgreement || false} disabled />
                <span className="text-body-s font-medium text-grayscale-gray6">네</span>
              </label>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?
              </h2>
              <Input
                value={formData?.allergyCheck || ''}
                readOnly
                placeholder="알러지 검사 여부와 결과(유무), 혹은 향후 계획"
                className="h-12"
              />
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full" />

          {/* 생활 패턴 섹션 */}
          <div className="flex flex-col gap-8 items-start w-full">
            <SectionHeader title={LIVING_ENVIRONMENT.sectionTitle} subtitle={LIVING_ENVIRONMENT.description} />
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                평균적으로 집을 비우는 시간은 얼마나 되나요?
              </h2>
              <Input
                value={formData?.awayTime || ''}
                readOnly
                placeholder="출퇴근·외출 시간을 포함해 하루 중 집을 비우는 시간"
                className="h-12"
              />
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                아이와 함께 지내게 될 공간을 소개해 주세요.
              </h2>
              <div className="w-full">
                <Textarea
                  value={formData?.livingSpace || ''}
                  readOnly
                  placeholder="반려동물이 주로 생활할 공간(예: 거실 등)과 환경(크기, 구조 등)"
                  maxLength={800}
                  showLength={(formData?.livingSpace || '').length > 0}
                  currentLength={(formData?.livingSpace || '').length}
                />
                <p className="text-caption font-medium text-grayscale-gray5 mt-2.5">
                  아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                현재 함께하는, 또는 이전에 함께했던 반려동물에 대해 알려주세요.
              </h2>
              <Textarea
                value={formData?.previousPets || ''}
                readOnly
                placeholder="반려동물의 품종, 성격, 함께한 기간, 이별 사유 등"
                maxLength={800}
                showLength={(formData?.previousPets || '').length > 0}
                currentLength={(formData?.previousPets || '').length}
              />
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full" />

          {/* 케어 관련 섹션 */}
          <div className="flex flex-col gap-8 items-start w-full">
            <SectionHeader title={CARE_RESPONSIBILITY.sectionTitle} subtitle={CARE_RESPONSIBILITY.description} />
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?
              </h2>
              <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox checked={formData?.basicCare || false} disabled />
                <span className="text-body-s font-medium text-grayscale-gray6">네</span>
              </label>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?
              </h2>
              <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                <Checkbox checked={formData?.medicalExpense || false} disabled />
                <span className="text-body-s font-medium text-grayscale-gray6">네</span>
              </label>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full" />

          {/* 선택 사항 섹션 */}
          <div className="flex flex-col gap-8 items-start w-full">
            <SectionHeader title={PET_SELECTION.sectionTitle} subtitle={PET_SELECTION.description} />
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">마음에 두신 아이가 있으신가요?</h2>
              {formData?.interestedAnimal && (
                <Input
                  value={
                    Array.isArray(formData.interestedAnimal)
                      ? formData.interestedAnimal.join('/')
                      : formData.interestedAnimal
                  }
                  readOnly
                  className="h-12"
                />
              )}
              {((Array.isArray(formData?.interestedAnimal) && formData.interestedAnimal.includes('특징 직접 입력')) ||
                (!Array.isArray(formData?.interestedAnimal) && formData?.interestedAnimal === '특징 직접 입력')) && (
                <Textarea
                  value={formData?.interestedAnimalDetails || ''}
                  readOnly
                  placeholder="원하시는 아이의 특징을 자유롭게 입력해주세요"
                  maxLength={800}
                  showLength={(formData?.interestedAnimalDetails || '').length > 0}
                  currentLength={(formData?.interestedAnimalDetails || '').length}
                />
              )}
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">원하시는 입양 시기가 있나요?</h2>
              <Input value={formData?.adoptionTiming || ''} readOnly className="h-12" />
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-grayscale-gray2 w-full" />

          {/* 마지막 메시지 */}
          <div className="flex flex-col gap-8 items-start w-full">
            <SectionHeader title={BREEDER_ADDITIONAL_QUESTION.title} subtitle={BREEDER_ADDITIONAL_QUESTION.subtitle} />
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?
              </h2>
              <Textarea
                value={formData?.additionalMessage || ''}
                readOnly
                maxLength={800}
                showLength={(formData?.additionalMessage || '').length > 0}
                currentLength={(formData?.additionalMessage || '').length}
              />
            </div>
          </div>
        </div>

        {/* 구분선 */}

        {/* 하단 버튼 */}
        <LargeDialogFooter className="flex flex-row justify-between items-center gap-[10px]">
          {status === 'before' && (
            <>
              <div className="flex items-start gap-1 md:items-center">
                <div className="size-3 flex justify-center items-center shrink-0 mt-0.5 md:mt-0">
                  <ErrorIcon className="w-3 h-3" />
                </div>
                <div className="flex flex-col gap-1 md:flex-row md:gap-0">
                  <p className="text-caption font-medium text-[#A0A0A0] md:hidden">상담이 끝나면 [상담 완료]를 눌러</p>
                  <p className="text-caption font-medium text-[#A0A0A0] md:hidden">
                    상대방이 후기를 남길 수 있게 해주세요.
                  </p>
                  <p className="text-caption font-medium text-[#A0A0A0] hidden md:block">
                    상담이 끝나면 [상담 완료]를 눌러 상대방이 후기를 남길 수 있게 해주세요.
                  </p>
                </div>
              </div>
              <button className="button-brown leading-[140%]" onClick={handleCompleteCounsel}>
                상담 완료
              </button>
            </>
          )}
          {status === 'done' && (
            <div className="flex items-center gap-2 w-full justify-end">
              <Button
                variant="tertiary"
                className="h-9 py-2 px-4 text-sm leading-[140%] tracking-[-2%] rounded-[--spacing(1)]"
                onClick={handleCancelComplete}
              >
                완료 취소
              </Button>
              <button className="button-disabled h-9 py-2 px-4 text-sm font-medium leading-[140%] " disabled>
                상담 완료
              </button>
            </div>
          )}
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
