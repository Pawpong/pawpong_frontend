"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationGuardContext } from "@/contexts/navigation-guard-context";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  CollapsibleProvider,
  useCollapsible,
} from "../filter-sidebar/collapsible-provider";
import Minus from "@/assets/icons/minus";
import Plus from "@/assets/icons/plus";
import { SheetClose } from "../ui/sheet";

interface MobileNavItemProps {
  item: NavItem;
  isLast: boolean;
}

export default function MobileNavItem({ item, isLast }: MobileNavItemProps) {
  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return <NavLink item={item} isActive={false} isLast={isLast} />;
  }

  return (
    <CollapsibleProvider>
      <CollapsibleNavSection item={item} isLast={isLast} />
    </CollapsibleProvider>
  );
}

function NavLink({
  item,
  isActive,
  isLast,
}: {
  item: NavItem;
  isActive: boolean;
  isLast: boolean;
}) {
  const pathname = usePathname();
  const guardContext = useNavigationGuardContext();
  const Icon = isActive ? item.iconFill : item.icon;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!guardContext?.guardNavigation || pathname === href) {
      return;
    }
    e.preventDefault();
    guardContext.guardNavigation(href);
  };

  return (
    <div className="flex flex-col">
      <SheetClose asChild>
        <Link
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className="flex items-center gap-3 rounded bg-white pl-0 pr-4"
        >
          <Icon className="size-5 shrink-0" />
          <div className="flex-1">
            <p
              className={cn(
                "text-heading-3 leading-heading-3 font-medium",
                isActive ? "text-primary" : "text-grayscale-gray6"
              )}
            >
              {item.name}
            </p>
          </div>
        </Link>
      </SheetClose>
      {!isLast && <Separator className="mt-6" />}
    </div>
  );
}

function CollapsibleNavSection({
  item,
  isLast,
}: {
  item: NavItem;
  isLast: boolean;
}) {
  const { open, setOpen } = useCollapsible();
  const pathname = usePathname();
  const guardContext = useNavigationGuardContext();
  const Icon = open ? item.iconFill : item.icon;

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!guardContext?.guardNavigation || pathname === href) {
      return;
    }
    e.preventDefault();
    guardContext.guardNavigation(href);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex flex-col">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded bg-white pl-0 pr-4 w-full"
          >
            <Icon className="size-5 shrink-0" />
            <div className="flex-1 text-left">
              <p
                className={cn(
                  "text-heading-3 leading-heading-3 font-medium",
                  open ? "text-primary" : "text-grayscale-gray6"
                )}
              >
                {item.name}
              </p>
            </div>
            <div className="flex items-center justify-center size-8 rounded-lg bg-tertiary-500 shrink-0">
              {open ? (
                <Minus className="size-4 text-grayscale-gray6" />
              ) : (
                <Plus className="size-4 text-grayscale-gray6" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <div className="flex flex-col mt-3 overflow-hidden transition-all duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:opacity-0 data-[state=closed]:mt-0 data-[state=closed]:max-h-0 max-h-[1000px]">
            {item.children?.map((child) => {
              const ChildIcon = child.icon;
              const isMuted = child.variant === "muted";
              const isDisabled = child.variant === "disabled";

              return (
                <SheetClose asChild key={child.name}>
                  <Link
                    href={child.href}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                        return;
                      }
                      handleLinkClick(e, child.href);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded bg-white pl-0 pr-4 py-2",
                      isDisabled && "pointer-events-none"
                    )}
                  >
                    {ChildIcon && <ChildIcon className="size-5 shrink-0" />}
                    <p
                      className={cn(
                        "text-body-s font-medium",
                        isMuted
                          ? "text-grayscale-gray5"
                          : isDisabled
                          ? "text-[#e1e1e1]"
                          : "text-grayscale-gray6"
                      )}
                    >
                      {child.name}
                    </p>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </CollapsibleContent>
        {!isLast && <Separator className="mt-6" />}
      </div>
    </Collapsible>
  );
}
