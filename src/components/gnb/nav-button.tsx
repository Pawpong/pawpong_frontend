"use client";

import Menu from "@/assets/icons/menu.svg";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import MobileNavMenu from "./mobile-nav-menu";

interface NavButtonProps {
  navVariant?: "default" | "breeder";
}

export default function NavButton({ navVariant = "breeder" }: NavButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 -m-1.5">
          <div className="flex items-center justify-center size-6">
            <Menu />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full">
        <SheetTitle className="sr-only">모바일 내비게이션</SheetTitle>
        <MobileNavMenu navVariant={navVariant} />
      </SheetContent>
    </Sheet>
  );
}
