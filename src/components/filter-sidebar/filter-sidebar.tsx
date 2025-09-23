"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import BreedFilter from "./breed-filter";
import ClearFilters from "./clear-filters";
import CurrentFilters from "./current-filters";
import LevelFilter from "./level-filter";
import LocationFilter from "./location-filter";
import { useSidebar } from "./sidebar-provider";

export default function FilterSidebar() {
  const { isOpen } = useSidebar();
  const isMobile = !useBreakpoint("md");
  return (
    isMobile || (
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out shrink-0",
          isOpen ? "w-84 pr-[calc(19.875rem+var(--gutter))]" : "w-0 pr-0"
        )}
      >
        <div className="space-y-6 lg:pb-15 md:pb-15 pb-10 w-[calc(19.875rem-(--spacing(4)))]">
          <div className="space-y-8">
            <ClearFilters />
            <CurrentFilters />
          </div>

          <Separator />
          <BreedFilter />
          <Separator />
          <LocationFilter />
          <Separator />
          <LevelFilter />
        </div>
      </div>
    )
  );
}
