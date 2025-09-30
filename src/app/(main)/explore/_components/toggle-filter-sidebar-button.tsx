"use client";

import Close from "@/assets/icons/close";
import Filter from "@/assets/icons/filter";
import CircleBadge from "@/components/cirlce-badge";
import FilterDialogTrigger from "@/components/filter-dialog/filter-dialog-trigger";
import { useSidebar } from "@/components/filter-sidebar/sidebar-provider";

import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useFilterStore } from "@/stores/filter-store";
export default function ToggleFilterSidebarButton() {
  const { toggleSidebar, isOpen } = useSidebar();
  const isMobile = !useBreakpoint("md");
  const activeFilters = useFilterStore((e) => e.activeFilters);
  const hasFilter = activeFilters.length > 0;
  return isMobile ? (
    <FilterDialogTrigger asChild>
      <Button variant="secondary" size="icon" className="relative">
        <Filter className="size-7" />
        {hasFilter && <CircleBadge className="absolute top-2 right-2" />}
      </Button>
    </FilterDialogTrigger>
  ) : (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => toggleSidebar()}
      className="relative"
    >
      {isOpen ? <Close className="size-5" /> : <Filter className="size-7" />}
      {hasFilter && <CircleBadge className="absolute  top-1.5 right-1.5" />}
    </Button>
  );
}
