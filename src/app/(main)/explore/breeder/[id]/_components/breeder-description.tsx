import { ExpandableText } from "@/components/ui/expandable-text";
import React from "react";
export default function BreederDescription({
  data,
  ...props
}: { data: string } & React.ComponentProps<"div">) {
  return <ExpandableText data={data} {...props} />;
}
