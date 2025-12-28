'use client';

import Logo from '@/assets/logo/logo';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationGuardContext } from '@/contexts/navigation-guard-context';
import { MouseEvent } from 'react';

export default function LogoButton() {
  const pathname = usePathname();
  const guardContext = useNavigationGuardContext();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Context가 없거나 홈 페이지면 기본 동작 허용
    if (!guardContext?.guardNavigation || pathname === '/') {
      return;
    }

    // 가드 로직 실행
    e.preventDefault();
    guardContext.guardNavigation('/');
  };

  return (
    <Link href="/" onClick={handleClick}>
      <Button variant={'ghost'} className="py-2 -mx-3 -my-2 h-auto has-[>svg]:px-2">
        <Logo className="w-20 h-auto text-primary-500" />
      </Button>
    </Link>
  );
}
