import Link from 'next/link';
import Kakao from '@/assets/icons/kakao';
import InstagramIcon from '@/assets/icons/instagram.svg';
import { SNS_LINKS } from '@/constants/footer';
import type { SNSIconType } from '@/constants/footer';

const ICON_MAP: Record<SNSIconType, React.ComponentType<{ className?: string }>> = {
  kakao: Kakao,
  instagram: InstagramIcon,
};

export default function FooterSNS() {
  return (
    <div className="flex gap-4 lg:gap-6">
      {SNS_LINKS.map(({ href, ariaLabel, iconType, iconClassName }) => {
        const Icon = ICON_MAP[iconType];
        return (
          <Link
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="group w-6 h-6 flex items-center justify-center hover:text-primary-500 active:text-primary-500 transition-colors"
          >
            <Icon className={iconClassName} />
          </Link>
        );
      })}
    </div>
  );
}
