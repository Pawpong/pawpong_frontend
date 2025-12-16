import type { ComponentType, SVGProps } from 'react';

import Search from '@/assets/icons/search';
import SearchFill from '@/assets/icons/search-fill';
import Letter from '@/assets/icons/letter';
import LetterFill from '@/assets/icons/letter-fill';
import Profile from '@/assets/icons/profile';
import ProfileFill from '@/assets/icons/profile-fill';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';

import type { VerificationStatus } from '@/stores/auth-store';

export type NavChildVariant = 'default' | 'muted' | 'disabled';
export type NavChildAction = 'logout';

export interface NavChildItem {
  name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: NavChildVariant;
  action?: NavChildAction;
  /** 이 메뉴를 표시할 verification status 목록 (브리더 전용, 미설정 시 항상 표시) */
  showForVerificationStatus?: VerificationStatus[];
}

export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconFill: ComponentType<SVGProps<SVGSVGElement>>;
  children?: NavChildItem[];
  /** 인증이 필요한 메뉴인지 여부 (비회원 클릭 시 로그인 페이지로 이동) */
  requiresAuth?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: '탐색',
    href: '/explore',
    icon: Search,
    iconFill: SearchFill,
    children: [
      { name: '강아지', href: '/explore/dog', icon: Dog },
      { name: '고양이', href: '/explore/cat', icon: Cat },
    ],
  },
  {
    name: '신청',
    href: '/application',
    icon: Letter,
    iconFill: LetterFill,
    requiresAuth: true,
  },
  {
    name: '마이',
    href: '/profile',
    icon: Profile,
    iconFill: ProfileFill,
    requiresAuth: true,
    children: [
      { name: '내 후기', href: '/myapplication' },
      { name: '찜한 브리더', href: '/saved' },
      { name: '공지사항', href: '/notice' },
      { name: '설정', href: '/settings' },
      { name: '문의하기', href: 'https://pf.kakao.com/_Wqxekn' },
      { name: '로그아웃', href: '#', variant: 'muted', action: 'logout' },
    ],
  },
];

export const NAV_ITEMS_BREEDER: NavItem[] = [
  {
    name: '탐색',
    href: '/explore',
    icon: Search,
    iconFill: SearchFill,
  },
  {
    name: '신청',
    href: '/application',
    icon: Letter,
    iconFill: LetterFill,
    requiresAuth: true,
  },
  {
    name: '마이',
    href: '/profile',
    icon: Profile,
    iconFill: ProfileFill,
    requiresAuth: true,
    children: [
      { name: '내 프로필', href: '/profile', showForVerificationStatus: ['approved'] },
      { name: '입점 서류 수정', href: '/profile/documents' },
      { name: '찜한 브리더', href: '/saved' },
      { name: '공지사항', href: '/notice' },
      { name: '설정', href: '/settings' },
      { name: '문의하기', href: 'https://pf.kakao.com/_Wqxekn' },
      { name: '로그아웃', href: '#', variant: 'muted', action: 'logout' },
    ],
  },
];
