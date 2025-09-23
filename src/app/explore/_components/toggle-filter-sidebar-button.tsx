"use client";

import Close from "@/assets/icons/close";
import Filter from "@/assets/icons/filter";
import { useSidebar } from "@/components/filter-sidebar/sidebar-provider";

import { Button } from "@/components/ui/button";
export default function ToggleFilterSidebarButton() {
  const { toggleSidebar, isOpen } = useSidebar();

  return (
    <Button variant="secondary" size="icon" onClick={toggleSidebar}>
      {isOpen ? <Close className="size-5" /> : <Filter className="size-7" />}
    </Button>
  );
}
