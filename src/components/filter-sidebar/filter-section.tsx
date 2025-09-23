import { Collapsible } from "../ui/collapsible";
import { CollapsibleProvider } from "./collapsible-provider";

export default function FilterSection(props: React.ComponentProps<"div">) {
  return (
    <CollapsibleProvider>
      <Collapsible defaultOpen>
        <div className="md:space-y-4 space-y-3" {...props}></div>
      </Collapsible>
    </CollapsibleProvider>
  );
}
