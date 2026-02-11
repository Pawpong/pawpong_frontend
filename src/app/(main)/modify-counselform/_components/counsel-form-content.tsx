'use client';

import { Suspense, useRef, useState, useCallback, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import { FormLayout, SubmitButton } from '../sections';
import { COUNSEL_SECTIONS } from '@/app/(main)/counselform/_constants/counsel-questions.constants';
import { CounselSection } from '@/app/(main)/counselform/_components/shared/counsel-section';
import BreederAdditionalQuestionSection from './sections/breeder-additional-question-section';
import type { BreederAdditionalQuestionSectionRef } from '../_types/breeder-question.types';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';
import { Separator } from '@/components/ui/separator';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { LoadingState } from '@/components/loading-state';
import { useCounselGuard } from '@/app/(main)/counselform/_hooks/use-counsel-guard';
import { useCounselForm } from '@/app/(main)/counselform/_hooks/use-counsel-form';
import { formatPhoneNumber } from '@/utils/phone';

/**
 * 상담 신청서 수정 페이지 내부 컴포넌트
 */
function CounselFormContentInner() {
  const isLgUp = useBreakpoint('lg');
  const searchParams = useSearchParams();
  const breederId = searchParams.get('breederId') || '';
  const petId = searchParams.get('petId') || undefined;
  const breederQuestionRef = useRef<BreederAdditionalQuestionSectionRef>(null);
  const [customQuestionState, setCustomQuestionState] = useState<{
    hasChanges: boolean;
    hasValidInput: boolean;
  }>({ hasChanges: false, hasValidInput: false });

  const { form, availablePets, hasFormData, isDisabled, isSubmitting, handleSubmit: originalHandleSubmit } = useCounselForm({
    breederId,
    petId,
  });
  const {
    showNavigationDialog,
    handleNavigationConfirm,
    handleNavigationCancel,
    showBrowserGuard,
    handleBrowserConfirm,
    handleBrowserCancel,
  } = useCounselGuard(hasFormData);

  // readonly 모드에서 사용할 formData
  const formData = form.watch();

  // 커스텀 질문 상태 변경 핸들러
  const handleStateChange = useCallback((hasChanges: boolean, hasValidInput: boolean) => {
    setCustomQuestionState({ hasChanges, hasValidInput });
  }, []);

  // 커스텀 질문 저장 로직을 포함한 handleSubmit
  const handleSubmit = useCallback(async () => {
    // 커스텀 질문이 유효한 경우: 커스텀 질문만 저장하고 종료 (다른 필드 검증 건너뛰기)
    if (customQuestionState.hasValidInput) {
      try {
        await breederQuestionRef.current?.saveQuestions();
        // 커스텀 질문 저장 성공 시 완료 처리 (다른 필드 검증 없이 종료)
        return;
      } catch {
        // 커스텀 질문 저장 실패 시 에러는 이미 toast로 표시됨
        return;
      }
    }

    // 커스텀 질문이 없는 경우에만 원래 handleSubmit 실행 (다른 필드 검증 포함)
    await originalHandleSubmit();
  }, [customQuestionState.hasValidInput, originalHandleSubmit]);

  // SubmitButton의 disabled 상태 계산
  const isSubmitDisabled = useMemo(() => {
    // 커스텀 질문이 유효하면 버튼 활성화 (다른 폼 필드와 관계없이)
    if (customQuestionState.hasValidInput) {
      return false;
    }
    // 커스텀 질문이 추가되었지만 내용이 없으면 비활성화
    const hasInvalidCustomQuestions = customQuestionState.hasChanges && !customQuestionState.hasValidInput;
    return isDisabled || hasInvalidCustomQuestions;
  }, [customQuestionState.hasValidInput, customQuestionState.hasChanges, isDisabled]);

  return (
    <FormProvider {...form}>
      <FormLayout hasFormData={hasFormData} isLgUp={isLgUp}>
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex w-full flex-col items-center pb-20 md:pb-24  md:px-4 lg:px-0.5">
            {COUNSEL_SECTIONS.filter((section) => section.sectionId !== 'additional-message').map((section, index, filteredSections) => {
              const isLast = index === filteredSections.length - 1;

              return (
                <div key={section.sectionId} className="w-full">
                  <CounselSection
                    section={section}
                    mode="readonly"
                    formData={formData}
                    availablePets={availablePets}
                    onFormatPhone={formatPhoneNumber}
                  />
                  {!isLast && <Separator className="bg-grayscale-gray2 my-15" />}
                </div>
              );
            })}
            {/* 브리더 추가 질문 섹션 */}
            <Separator className="bg-grayscale-gray2 my-15" />
            <div className="w-full">
              <BreederAdditionalQuestionSection
                ref={breederQuestionRef}
                onStateChange={handleStateChange}
              />
            </div>
          </div>
          <SubmitButton isDisabled={isSubmitDisabled} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </div>
      </FormLayout>

      {showNavigationDialog && (
        <ExitConfirmDialog
          hasData={hasFormData}
          onConfirm={handleNavigationConfirm}
          onCancel={handleNavigationCancel}
          open={showNavigationDialog}
          onOpenChange={(open) => {
            if (!open) {
              handleNavigationCancel();
            }
          }}
        />
      )}

      {showBrowserGuard && (
        <ExitConfirmDialog
          hasData={hasFormData}
          onConfirm={handleBrowserConfirm}
          onCancel={handleBrowserCancel}
          open={showBrowserGuard}
          onOpenChange={(open) => {
            if (!open) {
              handleBrowserCancel();
            }
          }}
        />
      )}
    </FormProvider>
  );
}

export default function CounselFormContent() {
  return (
    <Suspense fallback={<LoadingState fullScreen />}>
      <CounselFormContentInner />
    </Suspense>
  );
}
