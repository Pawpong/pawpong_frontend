'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export default function LoginButton() {
  const pathname = usePathname();
  // 현재 경로를 returnUrl로 전달 (홈에서 로그인하면 홈으로 돌아가도록)
  const loginUrl = pathname === '/' ? '/login?returnUrl=/' : '/login';

  return (
    <Link href={loginUrl}>
      <Button
        variant="tertiary"
        className="h-8 py-[var(--space-8)] px-[var(--space-12)] gap-[var(--space-4)] text-grayscale-gray6 text-body-xs font-normal hover:bg-secondary-600"
      >
        로그인
      </Button>
    </Link>
  );
}
