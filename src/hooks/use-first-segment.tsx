"use client";

import { usePathname } from "next/navigation";

export function useFirstSegment() {
  const pathname = usePathname(); // 예: "/tables/123"
  const segments = pathname.split("/").filter(Boolean); // ["tables", "123"]

  return segments[0] ?? ""; // 첫 번째 segment 없으면 빈 문자열
}
