"use client";

import Container from "@/components/ui/container";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import LoginSection from "./_components/login-section";

export default function Login() {
  const isPC = useBreakpoint("lg");
  return (
    <Container className="grid grid-cols-1 lg:grid-cols-2 gap-padding min-h-[calc(100vh-(--spacing(16)))]">
      {/* 왼쪽 이미지 */}
      {isPC && (
        <div className="h-full w-full pt-4 pb-padding">
          <div className="relative pl-12 pb-10 bg-primary-600 h-full" />
        </div>
      )}

      {/* 오른쪽 콘텐츠 */}
      <div className="flex items-center justify-center">
        <LoginSection />
      </div>
    </Container>
  );
}
