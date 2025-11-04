"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import Letter from "@/assets/icons/letter";
import LetterFill from "@/assets/icons/letter-fill";
import Profile from "@/assets/icons/profile";
import ProfileFill from "@/assets/icons/profile-fill";
import Search from "@/assets/icons/search";
import SearchFill from "@/assets/icons/search-fill";
import { useSegment } from "@/hooks/use-segment";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useNavigationGuardContext } from "@/contexts/navigation-guard-context";

const navItems = [
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
  },
];

export default function NavBar() {
  const currNav = useSegment(0);
  const pathname = usePathname();
  const guardContext = useNavigationGuardContext();

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Context가 없거나 같은 페이지면 기본 동작 허용
    if (!guardContext?.guardNavigation || pathname === href) {
      return;
    }

    // 가드 로직 실행
    e.preventDefault();
    guardContext.guardNavigation(href);
  };

  return (
    <div className="flex">
      {navItems.map((item) => {
        const active = currNav === item.href.slice(1);
        const Icon = active ? item.iconFill : item.icon;
        return (
          <Link
            href={item.href}
            key={item.name}
            onClick={(e) => handleLinkClick(e, item.href)}
          >
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                " h-auto gap-1.5 has-[>svg]:px-5 text-body-s text-grayscale-gray6 hover:text-primary! "
              )}
            >
              <Icon className="size-5" />
              <span
                className={cn({
                  "text-primary font-semibold": active,
                })}
              >
                {item.name}
              </span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
