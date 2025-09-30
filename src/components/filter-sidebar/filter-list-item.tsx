import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type FilterListItemProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"label">, "children">;

export default function FilterListItem({
  children,
  checked,
  onCheckedChange,
  ...props
}: FilterListItemProps) {
  return (
    <Label className="py-2 pr-4 gap-2" {...props}>
      <div className="size-5 flex items-center justify-center">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {children}
    </Label>
  );
}
