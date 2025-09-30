"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";
import { Separator } from "../ui/separator";
import AdoptableFilter from "./adoptable-filter";
import BreedFilter from "./breed-filter";
import ClearFilters from "./clear-filters";
import CurrentFilters from "./current-filters";
import LevelFilter from "./level-filter";
import LocationFilter from "./location-filter";
import { useSidebar } from "./sidebar-provider";

export default function FilterSidebar() {
  const { isOpen } = useSidebar();
  const isMobile = !useBreakpoint("md");
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const removeActiveFilter = useFilterStore(
    (state) => state.removeActiveFilter
  );

  return (
    isMobile || (
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out shrink-0",
          isOpen ? "w-84 pr-[calc(19.875rem+var(--gutter))]" : "w-0 pr-0"
        )}
      >
        <div className="space-y-6 lg:pb-15 md:pb-15 pb-10 w-[calc(19.875rem-(--spacing(4)))] pt-3">
          {activeFilters.length > 0 && (
            <div>
              <div className="space-y-8 pb-8">
                <ClearFilters />
                <CurrentFilters
                  selectedLeaves={activeFilters}
                  onRemove={removeActiveFilter}
                />
              </div>
              <Separator />
            </div>
          )}

          <AdoptableFilter />
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
