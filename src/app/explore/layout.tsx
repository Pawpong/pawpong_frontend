// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
// } from "@/components/ui/sidebar";
import AnimalTabs from "./_components/animal-tabs";
import FilterSortBar from "./_components/filter-sort-bar";

export default function Layout() {
  return (
    <div>
      <AnimalTabs />
      <FilterSortBar />
      {/* <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar> */}
    </div>
  );
}
