'use client';
import Gnb from '@/components/gnb/gnb';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationGuardProvider } from '@/contexts/navigation-guard-context';
import { QueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/stores/auth-store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isProfilePage = pathname === '/profile';
  const isProfileDocumentsPage = pathname === '/profile/documents';
  const isCounselFormPage = pathname === '/counselform';
  const useTertiaryVariant = isProfilePage || isProfileDocumentsPage || isCounselFormPage;

  const navVariant = user?.role === 'breeder' ? 'breeder' : 'default';

  return (
    <QueryProvider>
      <Suspense>
        <NavigationGuardProvider>
          <Gnb variant={useTertiaryVariant ? 'tertiary' : 'default'} navVariant={navVariant} />
          {children}
        </NavigationGuardProvider>
      </Suspense>
    </QueryProvider>
  );
}
