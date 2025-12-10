'use client';

import { useSocialProviderIcon } from '../_hooks/use-social-provider-icon';

interface SocialLoginSectionProps {
  email: string;
  provider: string;
}

export default function SocialLoginSection({ email, provider }: SocialLoginSectionProps) {
  const providerIcon = useSocialProviderIcon(provider);

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-body-s font-medium text-grayscale-gray5">소셜 로그인</h3>
      <div className="flex items-center gap-2  w-full">
        {providerIcon}
        <span className="text-body-s font-medium text-grayscale-gray6">{email}</span>
      </div>
    </div>
  );
}
