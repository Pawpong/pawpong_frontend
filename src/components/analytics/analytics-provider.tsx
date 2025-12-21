'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics';

/**
 * Google Analytics 페이지뷰 자동 트래킹 Provider
 *
 * Next.js App Router에서 페이지 변경 시 자동으로 pageview 이벤트 전송
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 페이지 로드 및 라우팅 변경 시 pageview 이벤트 전송
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

      // 약간의 지연을 두고 전송 (gtag 로드 대기)
      const timer = setTimeout(() => {
        pageview(url);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return null; // UI를 렌더링하지 않음
}
