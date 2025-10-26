import FilterSidebar from "@/components/filter-sidebar/filter-sidebar";
import { SidebarProvider } from "@/components/filter-sidebar/sidebar-provider";
import Container from "@/components/ui/container";
import AnimalTabs from "../_components/animal-tabs";
import FilterSortBar from "../_components/filter-sort-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AnimalTabs />
      <FilterSortBar />
      <Container className="flex">
        <FilterSidebar />
        <div className="flex-1 @container">{children}</div>
      </Container>
    </SidebarProvider>
  );
}
