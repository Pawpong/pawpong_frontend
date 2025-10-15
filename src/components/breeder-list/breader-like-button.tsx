import PawShadow from "@/assets/icons/paw-shadow";
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
      <PawShadow className="size-8" />
    </Button>
  );
}
