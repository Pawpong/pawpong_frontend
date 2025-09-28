"use client";

import Close from "@/assets/icons/close";
import Filter from "@/assets/icons/filter";
import FilterDialogTrigger from "@/components/filter-dialog/filter-dialog-trigger";
import { useSidebar } from "@/components/filter-sidebar/sidebar-provider";

import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
export default function ToggleFilterSidebarButton() {
  const { toggleSidebar, isOpen } = useSidebar();
  const isMobile = !useBreakpoint("md");

  return isMobile ? (
    <FilterDialogTrigger asChild>
      <Button variant="secondary" size="icon">
        {<Filter className="size-7" />}
      </Button>
    </FilterDialogTrigger>
  ) : (
    <Button variant="secondary" size="icon" onClick={() => toggleSidebar()}>
      {isOpen ? <Close className="size-5" /> : <Filter className="size-7" />}
    </Button>
  );
}
