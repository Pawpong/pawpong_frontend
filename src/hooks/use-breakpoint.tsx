'use client';

import * as React from 'react';

// Tailwind 스타일 브레이크포인트 (px로 변환)
const BREAKPOINTS: Record<string, number> = {
  sm: 0, // 0px 이상
  md: 48, // 48rem -> 768px
  lg: 80, // 80rem -> 1280px
};

// 모바일 : useBreakpoint("md") -> false
// 데스크탑 : useBreakpoint("md") -> true

export function useBreakpoint(min: 'sm' | 'md' | 'lg') {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const breakpoint = BREAKPOINTS[min];
    const query = `(min-width: ${breakpoint}rem)`;
    const mql = window.matchMedia(query);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [min]);

  return !!matches;
}
