import Container from "@/components/ui/container";
import HeaderFilters from "./header-filters";
import SortSelect from "./sort-select";
import ToggleFilterSidebarButton from "./toggle-filter-sidebar-button";

export default function FilterSortBar() {
  return (
    <Container className="flex justify-between items-center py-6 sticky top-0 bg-background">
      <div className="flex gap-2.5 items-center">
        <ToggleFilterSidebarButton />

        <HeaderFilters />
      </div>

      <SortSelect />
    </Container>
  );
}
