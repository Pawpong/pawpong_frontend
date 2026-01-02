import Kakao from '@/assets/logo/kakao';
import Google from '@/assets/logo/google';
import Naver from '@/assets/logo/naver';
import Apple from '@/assets/logo/apple';
import { ReactNode } from 'react';
import type { SocialProvider } from '../_hooks/social-provider';

const SOCIAL_PROVIDER_ICON_MAP: Record<SocialProvider, (props: { className?: string }) => ReactNode> = {
  kakao: (props) => <Kakao {...props} />,
  google: (props) => <Google {...props} />,
  naver: (props) => <Naver fillColor="#03C75A" {...props} />,
  apple: (props) => <Apple {...props} />,
};

export function renderSocialProviderIcon(provider: SocialProvider, className = 'size-5 shrink-0') {
  const Icon = SOCIAL_PROVIDER_ICON_MAP[provider];
  return <Icon className={className} />;
}
