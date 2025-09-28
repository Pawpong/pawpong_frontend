import { useFilterStore } from "@/stores/filter-store";
import { Button } from "../ui/button";

export default function ClearFilters({
  ...props
}: React.ComponentProps<typeof Button>) {
  const { clearAllFilters } = useFilterStore();
  return (
    <Button
      variant="text"
      className="h-auto p-0 font-normal underline underline-offset-2"
      onClick={clearAllFilters}
      {...props}
    >
      필터 초기화
    </Button>
  );
}
