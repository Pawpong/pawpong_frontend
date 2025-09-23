"use client";

import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import BreedFilter from "./breed-filter";
import CurrentFilters from "./current-filters";
import LevelFilter from "./level-filter";
import LocationFilter from "./location-filter";
import { useSidebar } from "./sidebar-provider";

export default function FilterSidebar() {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out ",
        isOpen ? "w-84 pr-[calc(19.875rem+var(--gutter))]" : "w-0 pr-0"
      )}
    >
      <div className="space-y-6 lg:pb-15 md:pb-15 pb-10 w-[calc(19.875rem-(--spacing(4)))]">
        <CurrentFilters />
        <BreedFilter />
        <Separator />
        <LocationFilter />
        <Separator />
        <LevelFilter />
      </div>
    </div>
  );
}
