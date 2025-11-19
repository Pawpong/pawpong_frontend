import type { ComponentType, SVGProps } from "react";

import Search from "@/assets/icons/search";
import SearchFill from "@/assets/icons/search-fill";
import Letter from "@/assets/icons/letter";
import LetterFill from "@/assets/icons/letter-fill";
import Profile from "@/assets/icons/profile";
import ProfileFill from "@/assets/icons/profile-fill";
import Cat from "@/assets/icons/cat";
import Dog from "@/assets/icons/dog";

export type NavChildVariant = "default" | "muted" | "disabled";

export interface NavChildItem {
  name: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: NavChildVariant;
}

export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconFill: ComponentType<SVGProps<SVGSVGElement>>;
  children?: NavChildItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "탐색",
    href: "/explore",
    icon: Search,
    iconFill: SearchFill,
    children: [
      { name: "고양이", href: "/explore/cat", icon: Cat },
      { name: "강아지", href: "/explore/dog", icon: Dog },
    ],
  },
  {
    name: "신청",
    href: "/application",
    icon: Letter,
    iconFill: LetterFill,
  },
  {
    name: "마이",
    href: "/profile",
    icon: Profile,
    iconFill: ProfileFill,
    children: [
      { name: "내 후기", href: "/myapplication" },
      { name: "찜한 브리더", href: "/saved" },
      { name: "공지사항", href: "/notice" },
      { name: "설정", href: "/profile/settings" },
      { name: "로그아웃", href: "/logout", variant: "muted" },
    ],
  },
];

export const NAV_ITEMS_BREEDER: NavItem[] = [
  {
    name: "탐색",
    href: "/explore",
    icon: Search,
    iconFill: SearchFill,
  },
  {
    name: "신청",
    href: "/application",
    icon: Letter,
    iconFill: LetterFill,
  },
  {
    name: "마이",
    href: "/profile",
    icon: Profile,
    iconFill: ProfileFill,
    children: [
      { name: "내 프로필", href: "/profile", variant: "disabled" },
      { name: "입점 서류 수정", href: "/profile/documents" },
      { name: "찜한 브리더", href: "/saved" },
      { name: "공지사항", href: "/notice" },
      { name: "설정", href: "/profile/settings" },
      { name: "로그아웃", href: "/logout", variant: "muted" },
    ],
  },
];
