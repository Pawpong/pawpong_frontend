"use client";

import { Switch } from "@/components/ui/switch";

interface EmailSettingsSectionProps {
  marketingAgreed: boolean;
  onMarketingAgreedChange: (checked: boolean) => void;
}

export default function EmailSettingsSection({
  marketingAgreed,
  onMarketingAgreedChange,
}: EmailSettingsSectionProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-body-s font-medium text-grayscale-gray5">
        이메일 수신 설정
      </h3>
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="text-body-s font-medium text-grayscale-gray6">
          광고성 정보 수신 동의
        </span>
        <Switch
          checked={marketingAgreed}
          onCheckedChange={onMarketingAgreedChange}
        />
      </div>
    </div>
  );
}

