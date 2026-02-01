'use client';

import React, { Suspense, type ComponentType } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import { FormLayout, SubmitButton, COUNSEL_FORM_SECTIONS } from '../sections';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';
import { Separator } from '@/components/ui/separator';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useCounselGuard } from '@/app/(main)/counselform/_hooks/use-counsel-guard';
import { useCounselForm } from '@/app/(main)/counselform/_hooks/use-counsel-form';
import { formatPhoneNumber } from '@/utils/phone';

function CounselFormContentInner() {
  const isLgUp = useBreakpoint('lg');
  const searchParams = useSearchParams();
  const breederId = searchParams.get('breederId') || '';
  const petId = searchParams.get('petId') || undefined;

  const { form, availablePets, hasFormData, isDisabled, isSubmitting } = useCounselForm({
    breederId,
    petId,
  });

  const breederQuestions = useWatch({ control: form.control, name: 'breederQuestions' });
  const hasQuestionsWithTitle = breederQuestions?.some((q) => q?.question?.trim().length > 0) ?? false;

  // modify-counselform에서는 breederQuestions만 검증
  const handleSubmit = async () => {
    if (!hasQuestionsWithTitle) {
      return;
    }

    // breederQuestions만 검증
    const isValid = await form.trigger('breederQuestions');
    const formData = form.getValues();

    if (!isValid) {
      return;
    }

    // breederQuestions만 서버로 전송 (나중에 API 구현 시 사용)
    console.log('Breeder questions to save:', formData.breederQuestions);
    
    // TODO: 실제 저장 API 호출
    // await saveBreederQuestions(formData.breederQuestions);
  };
  const {
    showNavigationDialog,
    handleNavigationConfirm,
    handleNavigationCancel,
    showBrowserGuard,
    handleBrowserConfirm,
    handleBrowserCancel,
  } = useCounselGuard(hasFormData);

  return (
    <FormProvider {...form}>
      <FormLayout hasFormData={hasFormData} isLgUp={isLgUp} showHeader={false}>
        <div className="w-full lg:w-1/2 flex flex-col [&_input[data-slot='input']:not([data-breeder-question-input])]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_input[data-slot='input']:not([data-breeder-question-input])]:pointer-events-none [&_input[data-slot='input']:not([data-breeder-question-input])]:cursor-not-allowed [&_input[data-slot='input']:not([data-breeder-question-input])]:disabled [&_textarea[data-slot='textarea']]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_textarea[data-slot='textarea']]:pointer-events-none [&_textarea[data-slot='textarea']]:cursor-not-allowed [&_textarea[data-slot='textarea']]:disabled [&_div[class*='bg-white'][class*='rounded-lg']:has(textarea)]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_label[class*='bg-white'][class*='rounded-lg']]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_label[class*='bg-white'][class*='rounded-lg']]:pointer-events-none [&_label[class*='bg-white'][class*='rounded-lg']:has([data-slot='checkbox']):cursor-not-allowed [&_button[data-slot='button'][class*='bg-white']]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_button[data-slot='button'][class*='bg-white']]:pointer-events-none [&_button[data-slot='button'][class*='bg-white']]:cursor-not-allowed [&_button[data-slot='button'][class*='bg-white']]:disabled [&_[data-slot='dropdown-menu-trigger']]:bg-[var(--Alpha-W-40,rgba(255,255,255,0.40))] [&_[data-slot='dropdown-menu-trigger']]:pointer-events-none [&_[data-slot='dropdown-menu-trigger']]:cursor-not-allowed [&_[data-slot='dropdown-menu-trigger']]:disabled [&_[data-slot='checkbox']]:pointer-events-none [&_[data-slot='checkbox']]:cursor-not-allowed [&_[data-slot='checkbox']]:disabled [&_[data-slot='dropdown-menu-item']]:pointer-events-none [&_[data-slot='dropdown-menu-item']]:cursor-not-allowed">
          <div className="flex w-full flex-col items-center pb-20 md:pb-24  md:px-4 lg:px-0.5">
            {/* 제목 섹션 */}
            <div className="flex flex-col items-center w-full text-center my-15">
              <div className="flex flex-col text-center mb-3 text-heading-2 font-semibold text-primary-500 gap-3">
                <p>입양 희망자에게 궁금한 질문을 추가해<br/> 맞춤 신청서를 만들어 주세요.</p>

              </div>
              <div className="flex flex-col text-body-m font-medium text-grayscale-gray6">
                <p>
                  기본 필수 질문 외에 <span className="text-[#4e9cf1]">브리더님만의 질문</span>을 자유롭게 추가할 수 있어요.
                </p>
              </div>
            </div>
            {COUNSEL_FORM_SECTIONS.map((section, index: number) => {
              const isLast = index === COUNSEL_FORM_SECTIONS.length - 1;
              const isBreederQuestion = section.id === 'breeder-additional-question';
              const prevSection = index > 0 ? COUNSEL_FORM_SECTIONS[index - 1] : null;
              const shouldAddGap = isBreederQuestion && prevSection?.id === 'pet-selection';

              return (
                <div key={section.id} className="w-full">
                  {(() => {
                    switch (section.id) {
                      case 'privacy-and-basic-info': {
                        const SectionComponent = section.Component as ComponentType<{
                          onFormatPhone: (v: string) => string;
                        }>;
                        return <SectionComponent onFormatPhone={(v: string) => formatPhoneNumber(v)} />;
                      }
                      case 'pet-selection': {
                        const SectionComponent = section.Component as ComponentType<{
                          availablePets: typeof availablePets;
                        }>;
                        return <SectionComponent availablePets={availablePets} />;
                      }
                      default: {
                        const SectionComponent = section.Component as ComponentType;
                        return <SectionComponent />;
                      }
                    }
                  })()}
                  {!isLast && !shouldAddGap && <Separator className="bg-grayscale-gray2 my-15" />}
                </div>
              );
            })}
          </div>
          <SubmitButton
            isDisabled={isDisabled && !hasQuestionsWithTitle}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            buttonText="저장하기"
            submittingText="저장 중..."
          />
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <CounselFormContentInner />
    </Suspense>
  );
}
