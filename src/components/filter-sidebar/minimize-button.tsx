import Minus from "@/assets/icons/minus";
import Plus from "@/assets/icons/plus";
import { Button } from "../ui/button";
import { CollapsibleTrigger } from "../ui/collapsible";
import { useCollapsible } from "./collapsible-provider";

interface MinimizeButtonProps {
  inverted?: boolean;
}

export default function MinimizeButton({
  inverted = false,
}: MinimizeButtonProps) {
  const { open, toggle } = useCollapsible();
  const showMinus = inverted ? open : !open;

  return (
    <CollapsibleTrigger asChild>
      <Button
        size="icon"
        className="size-8"
        variant="secondary"
        onClick={toggle}
      >
        {showMinus ? <Minus className="size-5" /> : <Plus className="size-5" />}
      </Button>
    </CollapsibleTrigger>
  );
}
