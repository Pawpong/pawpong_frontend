'use client';

import React, { Suspense } from 'react';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import { FormLayout, SubmitButton } from '../sections';
import { COUNSEL_SECTIONS } from '@/app/(main)/counselform/_constants/counsel-questions.constants';
import { CounselSection } from '@/app/(main)/counselform/_components/shared/counsel-section';
import BreederAdditionalQuestionSection from './sections/breeder-additional-question-section';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';
import { Separator } from '@/components/ui/separator';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { LoadingState } from '@/components/loading-state';
import { useCounselGuard } from '@/app/(main)/counselform/_hooks/use-counsel-guard';
import { useCounselForm } from '@/app/(main)/counselform/_hooks/use-counsel-form';
import { formatPhoneNumber } from '@/utils/phone';

function CounselFormContentInner() {
  const isLgUp = useBreakpoint('lg');
  const searchParams = useSearchParams();
  const breederId = searchParams.get('breederId') || '';
  const petId = searchParams.get('petId') || undefined;

  const { form, availablePets, hasFormData, isDisabled, isSubmitting, handleSubmit } = useCounselForm({
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
              <BreederAdditionalQuestionSection />
            </div>
          </div>
          <SubmitButton isDisabled={isDisabled} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
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
