import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function FilterListItem({
  children,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <Label className="py-2 pr-4 gap-2" {...props}>
      <Checkbox />
      {children}
    </Label>
  );
}
