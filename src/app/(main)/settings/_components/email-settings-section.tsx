'use client';

import { Switch } from '@/components/ui/switch';

interface EmailSettingsSectionProps {
  marketingAgreed: boolean;
  onMarketingAgreedChange: (checked: boolean) => void;
  isBreeder?: boolean;
  consultationAgreed?: boolean;
  onConsultationAgreedChange?: (checked: boolean) => void;
}

export default function EmailSettingsSection({
  marketingAgreed,
  onMarketingAgreedChange,
  isBreeder = false,
  consultationAgreed = false,
  onConsultationAgreedChange,
}: EmailSettingsSectionProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-body-s font-medium text-grayscale-gray5">알림 수신 설정</h3>
      {/* {isBreeder && (
        <>
          <div className="flex flex-col gap-[0.62rem] w-full">
            <div className="flex items-center justify-between gap-3 w-full">
              <span className="text-body-s font-medium text-grayscale-gray6">상담 신청 알림톡 수신 동의</span>
              <Switch
                checked={consultationAgreed}
                onCheckedChange={onConsultationAgreedChange}
                className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
              />
            </div>
            <p className="text-caption font-medium text-grayscale-gray5">
              입양 상담이 도착하면 카카오톡으로 바로 알려드릴게요
            </p>
          </div>
        </>
      )} */}
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="text-body-s font-medium text-grayscale-gray6">광고성 정보 수신 동의</span>
        <Switch
          checked={marketingAgreed}
          onCheckedChange={onMarketingAgreedChange}
          className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
        />
      </div>
    </div>
  );
}
