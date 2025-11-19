"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { useSegment } from "@/hooks/use-segment";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useNavigationGuardContext } from "@/contexts/navigation-guard-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NAV_ITEMS, NAV_ITEMS_BREEDER } from "./nav-items";

interface NavBarProps {
  navVariant?: "default" | "breeder";
}

export default function NavBar({ navVariant = "default" }: NavBarProps) {
  const currNav = useSegment(0);
  const pathname = usePathname();
  const guardContext = useNavigationGuardContext();
  const navConfig = navVariant === "breeder" ? NAV_ITEMS_BREEDER : NAV_ITEMS;

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
      {navConfig.map((item) => {
        const active = currNav === item.href.slice(1);
        const Icon = active ? item.iconFill : item.icon;
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren) {
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
                  "h-auto gap-1.5 has-[>svg]:px-5 text-body-s text-grayscale-gray6 hover:text-primary!"
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
        }

        return (
          <DropdownMenu key={item.name}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto gap-1.5 has-[>svg]:px-5 text-body-s text-grayscale-gray6",
                  active && "text-primary"
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
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={12}
              className="border border-grayscale-gray2/50 rounded-lg p-1 shadow-[0px_8px_24px_rgba(12,17,29,0.12)] "
            >
              {item.children?.map((child) => {
                const ChildIcon = child.icon;
                const isMuted = child.variant === "muted";
                const isDisabled = child.variant === "disabled";
                return (
                  <DropdownMenuItem
                    key={child.name}
                    asChild
                    className={cn(
                      "px-4 py-2 text-body-s text-grayscale-gray7 gap-3 cursor-pointer w-[9.5625rem]",
                      isMuted && "text-grayscale-gray5 font-medium",
                      isDisabled &&
                        "text-[#e1e1e1] font-medium cursor-default pointer-events-none"
                    )}
                  >
                    <Link
                      href={child.href}
                      onClick={(e) => handleLinkClick(e, child.href)}
                      aria-disabled={isDisabled}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          !ChildIcon && "gap-0"
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon className="size-5 text-grayscale-gray5" />
                        )}
                        <span>{child.name}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
