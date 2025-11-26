import { Collapsible } from "../ui/collapsible";
import { CollapsibleProvider } from "./collapsible-provider";

export default function FilterSection(props: React.ComponentProps<"div">) {
  return (
    <CollapsibleProvider>
      <Collapsible defaultOpen>
        <div {...props} />
      </Collapsible>
    </CollapsibleProvider>
  );
}
