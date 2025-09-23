import Close from "@/assets/icons/close";
import { Button } from "../ui/button";

export default function CurrentFilters({
  selectedLeaves,
}: {
  selectedLeaves?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(selectedLeaves || []).map((filter) => (
        <Button
          variant="filter"
          key={filter}
          size="sm"
          className="h-auto py-1.5 px-3 gap-2"
        >
          {filter}
          <Close className="size-4" />
        </Button>
      ))}
    </div>
  );
}
