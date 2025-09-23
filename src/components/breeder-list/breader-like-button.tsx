import Paw from "@/assets/icons/paw";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function BreederLikeButton({
  className,
  ...props
}: { className?: string } & React.ComponentProps<"button">) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-grayscale-white size-8", className)}
      {...props}
    >
      <Paw className="size-8" />
    </Button>
  );
}
