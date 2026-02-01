'use client';

import type { ReactNode } from 'react';

import LeftArrow from '@/assets/icons/left-arrow.svg';
import CounselBannerCarousel from '@/components/counsel-banner/counsel-banner-carousel';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';

type FormLayoutProps = {
  children: ReactNode;
  hasFormData: boolean;
  isLgUp: boolean;
  showHeader?: boolean;
};

export default function FormLayout({ children, hasFormData, isLgUp, showHeader = true }: FormLayoutProps) {
  return (
    <>
      {showHeader && (
        <div className="sticky top-0 z-10 w-full py-6 bg-tertiary-500-basic">
          <ExitConfirmDialog hasData={hasFormData}>
            <button className="bg-white size-9 flex gap-2.5 items-center justify-center rounded-lg hover:bg-tertiary-600">
              <LeftArrow />
            </button>
          </ExitConfirmDialog>
        </div>
      )}

      <div className="min-h-screen flex w-full flex-col lg:flex-row">
        {isLgUp && (
          <div className="lg:w-[648px] lg:pr-8 bg-tertiary-500">
            <div className="lg:h-[744px]">
              <CounselBannerCarousel />
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
}
