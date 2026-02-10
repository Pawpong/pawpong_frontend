export interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface CompanyInfo {
  label: string;
  value: string;
}

export type SNSIconType = 'kakao' | 'instagram';

export interface SNSLink {
  href: string;
  ariaLabel: string;
  iconType: SNSIconType;
  iconClassName: string;
}

export const FOOTER_LINKS: FooterLink[] = [
  { href: '/introduction', label: '서비스 소개' },
  { href: '/faq', label: '자주 묻는 질문' },
  { href: '/announcements', label: '공지사항' },
  { href: '/terms-of-service', label: '이용 약관' },
  { href: '/terms-of-privacy', label: '개인정보처리방침' },
  {
    href: 'https://brassy-client-c0a.notion.site/2cc2f1c4b966807f8449ccff62111c02',
    label: '광고・제휴',
    external: true,
  },
];

export const COMPANY_INFO: CompanyInfo[] = [
  { label: '대표이사', value: '양세빈' },
  { label: '이메일', value: 'pawriendsofficial@gmail.com' },
  { label: '사업자등록번호', value: '407-08-67659' },
  { label: '주소', value: '서울시 서초구 사임당로8길13, 4층 402호' },
];

export const SNS_LINKS: SNSLink[] = [
  {
    href: 'https://pf.kakao.com/_Wqxekn',
    ariaLabel: '카카오톡 채널',
    iconType: 'kakao',
    iconClassName:
      'w-6 h-6 pointer-events-none [&_path]:fill-[var(--color-grayscale-gray5)] group-hover:[&_path]:fill-[var(--color-primary-500)] group-active:[&_path]:fill-[var(--color-primary-500)]',
  },
  {
    href: 'https://www.instagram.com/pawpong_official/',
    ariaLabel: '인스타그램',
    iconType: 'instagram',
    iconClassName:
      'w-6 h-6 pointer-events-none group-hover:[&_path]:fill-[var(--color-primary-500)] group-active:[&_path]:fill-[var(--color-primary-500)]',
  },
];
