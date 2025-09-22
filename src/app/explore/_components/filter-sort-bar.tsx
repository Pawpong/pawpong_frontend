import Container from "@/components/ui/container";
import CurrentFilter from "./current-filter";
import CurrentSort from "./current-sort";

export default function FilterSortBar() {
  return (
    <Container className="flex justify-between items-center py-6">
      <CurrentFilter />
      <CurrentSort />
    </Container>
  );
}
