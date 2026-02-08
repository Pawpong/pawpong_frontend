import FooterLinks from './footer-links';
import FooterSNS from './footer-SNS';
import FooterCompanyInfo from './footer-company-info';

interface FooterProps {
  variant?: 'default' | 'tertiary';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const bgClass = variant === 'tertiary' ? 'bg-tertiary-500' : 'bg-white';
  return (
    <footer className={bgClass}>
      <div className="px-5 md:px-10 lg:px-12 py-7 lg:py-[28px] pb-9 lg:pb-9">
        {/* 상단 */}
        <div className="flex flex-row justify-between gap-10 md:gap-0 mb-10 lg:mb-10">
          <FooterLinks />
          <FooterSNS />
        </div>

        {/* 하단 */}
        <div className="flex flex-col gap-4 md:gap-4">
          <FooterCompanyInfo />

          {/* Copyright */}
          <p className="text-[11px] md:text-xs font-normal text-grayscale-gray5 mt-0 md:mt-0">
            Copyright © 2025 Pawpong Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
