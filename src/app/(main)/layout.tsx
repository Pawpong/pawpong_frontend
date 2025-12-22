'use client';
import Gnb from '@/components/gnb/gnb';
import Footer from '@/components/footer/footer';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationGuardProvider } from '@/contexts/navigation-guard-context';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { useAuthStore } from '@/stores/auth-store';

function LayoutContentInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, hasHydrated } = useAuthStore();
  const isProfilePage = pathname === '/profile';
  const isProfileDocumentsPage = pathname === '/profile/documents';
  const isCounselFormPage = pathname === '/counselform';
  const useTertiaryVariant = isProfilePage || isProfileDocumentsPage || isCounselFormPage;

  const navVariant = user?.role === 'breeder' ? 'breeder' : 'default';

  return (
    <NavigationGuardProvider>
      <div className="flex flex-col min-h-screen">
        {hasHydrated && <Gnb variant={useTertiaryVariant ? 'tertiary' : 'default'} navVariant={navVariant} />}
        <main className="flex-1">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
    </NavigationGuardProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <LayoutContentInner>{children}</LayoutContentInner>
    </Suspense>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </QueryProvider>
  );
}
