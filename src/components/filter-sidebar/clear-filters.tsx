import { Button } from "../ui/button";

export default function ClearFilters({
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="text"
      className="h-auto p-0 font-normal underline underline-offset-2"
      {...props}
    >
      필터 초기화
    </Button>
  );
}
