"use client";

import LetterFillIcon from "@/assets/icons/letter-fill.svg";
import LetterIcon from "@/assets/icons/letter.svg";
import ProfileFillIcon from "@/assets/icons/profile-fill.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import SearchFillIcon from "@/assets/icons/search-fill.svg";
import SearchIcon from "@/assets/icons/search.svg";
import Link from "next/link";

import { useFirstSegment } from "@/hooks/use-first-segment";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const navItems = [
  {
    name: "탐색",
    href: "/explore",
    icon: SearchIcon,
    iconFill: SearchFillIcon,
  },
  {
    name: "신청",
    href: "/application",
    icon: LetterIcon,
    iconFill: LetterFillIcon,
  },
  {
    name: "마이",
    href: "/profile",
    icon: ProfileIcon,
    iconFill: ProfileFillIcon,
  },
];

export default function NavBar() {
  const currNav = useFirstSegment();

  return (
    <div className="flex">
      {navItems.map((item) => {
        const active = currNav === item.href.slice(1);
        const Icon = active ? item.iconFill : item.icon;
        return (
          <Link href={item.href} key={item.name}>
            <Button
              key={item.name}
              variant="link"
              className={cn("h-auto text-body-s text-grayscale-gray6", {
                "text-primary font-semibold": active,
              })}
            >
              <Icon className="size-5" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
