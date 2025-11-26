"use client";

import { NAV_ITEMS, NAV_ITEMS_BREEDER } from "./nav-items";
import MobileNavHeader from "./mobile-nav-header";
import MobileNavItem from "./mobile-nav-item";

interface MobileNavMenuProps {
  navVariant?: "default" | "breeder";
}

export default function MobileNavMenu({
  navVariant = "default",
}: MobileNavMenuProps) {
  const navConfig = navVariant === "breeder" ? NAV_ITEMS_BREEDER : NAV_ITEMS;

  return (
    <div className="flex flex-col h-full bg-white">
      <MobileNavHeader />
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-0">
        <div className="flex flex-col gap-6">
          {navConfig.map((item, index) => (
            <MobileNavItem
              key={item.name}
              item={item}
              isLast={index === navConfig.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
