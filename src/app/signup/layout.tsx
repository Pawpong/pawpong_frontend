import Container from '@/components/ui/container';
import React from 'react';
import Header from './_components/header';
import SignupProfileBannerDisplay from './_components/signup-profile-banner-display';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-tertiary-500">
      <Header />
      <Container className="lg:pr-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-padding min-h-[calc(100vh-(--spacing(16)))]">
          <div className=" pt-4 pb-padding hidden lg:block w-full sticky top-[--spacing(16)] h-[calc(100vh-(--spacing(16)))]">
            <SignupProfileBannerDisplay />
          </div>
          <div className="h-full flex justify-center w-full pb-padding  ">{children}</div>
        </div>
      </Container>
    </div>
  );
}
