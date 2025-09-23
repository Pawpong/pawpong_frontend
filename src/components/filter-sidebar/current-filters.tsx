import Close from "@/assets/icons/close";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function CurrentFilters() {
  const filters = [
    "시베리안(트래디셔널, 네바마스커레이드)",
    "안성시",
    "용인시",
  ];
  return (
    <div className="space-y-8">
      <Button
        variant="text"
        className="h-auto p-0 font-normal underline underline-offset-2"
      >
        필터 초기화
      </Button>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            variant="filter"
            key={filter}
            size="sm"
            className="h-auto py-1.5 px-3"
          >
            {filter}
            <Close className="size-4" />
          </Button>
        ))}
      </div>
      <Separator />
    </div>
  );
}
