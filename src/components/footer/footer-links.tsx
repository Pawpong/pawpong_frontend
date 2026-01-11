import Link from 'next/link';
import { FOOTER_LINKS } from '@/constants/footer';

export default function FooterLinks() {
  return (
    <div className="flex flex-col gap-4">
      {FOOTER_LINKS.map(({ href, label, external }) => (
        <Link
          key={label}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-[11px] md:text-xs font-semibold text-grayscale-gray5"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
