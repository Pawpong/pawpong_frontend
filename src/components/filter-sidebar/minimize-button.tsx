import Minus from "@/assets/icons/minus";
import Plus from "@/assets/icons/plus";
import { Button } from "../ui/button";
import { CollapsibleTrigger } from "../ui/collapsible";
import { useCollapsible } from "./collapsible-provider";

export default function MinimizeButton() {
  const { open, toggle } = useCollapsible();
  return (
    <CollapsibleTrigger asChild>
      <Button
        size="icon"
        className="size-8"
        variant="secondary"
        onClick={toggle}
      >
        {!open ? <Minus className="size-5" /> : <Plus className="size-5" />}
      </Button>
    </CollapsibleTrigger>
  );
}
