import { ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useOath } from "./oath-provider";

interface OathWithDialogProps {
  onCheckedChange?: (checked: boolean) => void;
  children: React.ReactNode;
}

export function Oath({ onCheckedChange, children }: OathWithDialogProps) {
  const { checked, setChecked } = useOath();

  React.useEffect(() => {
    if (onCheckedChange) onCheckedChange(checked);
  }, [checked, onCheckedChange]);

  return (
    <div className="flex items-center">
      <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
        <div className="size-5 flex items-center justify-center">
          <Checkbox
            checked={checked}
            onClick={(e) => {
              if (checked) {
                e.stopPropagation();
                setChecked(false);
              } else {
                setChecked(true);
              }
            }}
          />
        </div>
        {children}
      </div>

      <Button
        variant="ghost"
        className="py-2 px-0 gap-1 text-grayscale-gray5 -mx-2.5 cursor-pointer -my-2"
      >
        <span className="text-body-xs font-medium">보기</span>{" "}
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}
