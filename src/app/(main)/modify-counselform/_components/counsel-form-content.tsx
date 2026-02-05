'use client';

import React, { Suspense, type ComponentType } from 'react';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import { FormLayout, SubmitButton, COUNSEL_FORM_SECTIONS } from '../sections';
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

  return (
    <FormProvider {...form}>
      <FormLayout hasFormData={hasFormData} isLgUp={isLgUp}>
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex w-full flex-col items-center pb-20 md:pb-24  md:px-4 lg:px-0.5">
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
