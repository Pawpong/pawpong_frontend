"use client";

import { Button } from "@/components/ui/button";

interface WithdrawSectionProps {
  onWithdraw?: () => void;
}

export default function WithdrawSection({ onWithdraw }: WithdrawSectionProps) {
  return (
    <div className="flex items-center justify-start lg:justify-center gap-0.5">
      <Button
        variant="ghost"
        onClick={onWithdraw}
        className="p-0 h-auto text-body-s font-normal text-grayscale-gray5 underline hover:text-primary"
      >
        탈퇴하기
      </Button>
    </div>
  );
}
