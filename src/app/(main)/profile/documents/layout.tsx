import Container from '@/components/ui/container';
import CounselBannerDisplay from '@/components/counsel-banner/counsel-banner-display';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-tertiary-500">
      <Container className="lg:pr-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-padding min-h-[calc(100vh-(--spacing(16)))]">
          <div className="pt-4 pb-padding hidden lg:block w-full sticky top-[--spacing(16)] h-[calc(100vh-(--spacing(16)))]">
            <CounselBannerDisplay />
          </div>
          <div className="h-full flex justify-center w-full pb-padding">{children}</div>
        </div>
      </Container>
    </div>
  );
}
