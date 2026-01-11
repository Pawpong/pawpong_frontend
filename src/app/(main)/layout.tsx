'use client';
import Gnb from '@/components/gnb/gnb';
import Footer from '@/components/footer/footer';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationGuardProvider } from '@/contexts/navigation-guard-context';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { useAuthStore } from '@/stores/auth-store';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, hasHydrated } = useAuthStore();
  const isProfilePage = pathname === '/profile';
  const isProfileDocumentsPage = pathname === '/profile/documents';
  const isCounselFormPage = pathname === '/counselform';
  const useTertiaryVariant = isProfilePage || isProfileDocumentsPage || isCounselFormPage;

  const navVariant = user?.role === 'breeder' ? 'breeder' : 'default';

  return (
    <Suspense>
      <NavigationGuardProvider>
        <div className="flex flex-col min-h-screen">
          {hasHydrated && <Gnb variant={useTertiaryVariant ? 'tertiary' : 'default'} navVariant={navVariant} />}
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </NavigationGuardProvider>
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
