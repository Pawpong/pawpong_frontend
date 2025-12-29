'use client';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuthStore } from '@/stores/auth-store';
import Container from '../ui/container';
import LogoButton from './logo-button';
import NavBar from './nav-bar';
import NavButton from './nav-button';
import NoticeButton from './notice-button';
import LoginButton from './login-button';

interface GnbProps {
  variant?: 'default' | 'tertiary';
  navVariant?: 'default' | 'breeder';
}

export default function Gnb({ variant = 'default', navVariant = 'breeder' }: GnbProps) {
  const isLg = useBreakpoint('lg');
  const { user } = useAuthStore();
  const bgClass = variant === 'tertiary' ? 'bg-tertiary-500' : 'bg-background';

  return (
    <div className={bgClass}>
      <Container className="h-16 flex items-center justify-between">
        <LogoButton />
        {isLg && <NavBar navVariant={navVariant} />}
        <div className="flex gap-4 items-center">
          {isLg && (user ? <NoticeButton /> : <LoginButton />)}
          {!isLg && !user && <LoginButton />}
          {!isLg && <NavButton navVariant={navVariant} />}
        </div>
      </Container>
    </div>
  );
}
