import Close from "@/assets/icons/close";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// --- 수정: props 타입 정의 및 onRemove 추가 ---
type CurrentFiltersProps = {
  selectedLeaves?: string[];
  onRemove?: (filter: string) => void;
};

export default function CurrentFilters({
  className,
  selectedLeaves,
  onRemove,
}: CurrentFiltersProps & React.ComponentProps<"div">) {
  return (
    <div className={cn(`flex flex-wrap gap-2`, className)}>
      {(selectedLeaves || []).map((filter) => (
        <Button
          variant="filter"
          key={filter}
          size="sm"
          className="h-auto py-1.5 px-3 gap-2"
          // --- 수정: onClick 이벤트 핸들러 추가 ---
          // onRemove 함수가 있을 경우에만 실행합니다.
          onClick={() => onRemove?.(filter)}
        >
          {filter}
          <Close className="size-4" />
        </Button>
      ))}
    </div>
  );
}
