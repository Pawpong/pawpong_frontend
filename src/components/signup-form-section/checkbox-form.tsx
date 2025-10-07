import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import CheckboxFormLabel from "./checkbox-form-label";

export default function CheckboxForm({
  checked,
  onCheckedChange,
  label,
  href,
}: {
  label: string;
  checked: boolean;
  href?: string;
  onCheckedChange: (checked: boolean) => void;
} & ComponentProps<"div">) {
  return (
    <div className="py-2 flex items-center">
      <Label className="flex-1">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <CheckboxFormLabel>{label}</CheckboxFormLabel>
      </Label>
      {href && (
        <Link href={href}>
          <Button
            variant="ghost"
            className="py-2 px-0 gap-1 text-grayscale-gray5 -mx-2.5 cursor-pointer -my-2"
          >
            <span className="text-body-xs font-medium">보기</span>{" "}
            <ChevronRight className="size-3.5" />
          </Button>
        </Link>
      )}
    </div>
  );
}
