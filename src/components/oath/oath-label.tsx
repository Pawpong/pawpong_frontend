import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useOath } from "./oath-provider";

export function OathLabel({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const { checked, setChecked } = useOath();
  return (
    <div className="flex items-center cursor-pointer">
      <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
        <div className="size-5 flex items-center justify-center">
          <Checkbox
            checked={checked}
            onClick={(e) => {
              if (checked) {
                e.stopPropagation();
                setChecked(false);
              }
            }}
          />
        </div>
        <span
          className={cn(
            "text-body-xs text-grayscale-gray6 select-none",
            className
          )}
          {...props}
        >
          {children}
        </span>
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-2.5 text-grayscale-gray5 text-body-xs"
      >
        <div>보기</div>
        <div className="size-5 flex items-center justify-center">
          <ChevronRight className="size-4" />
        </div>
      </Button>
    </div>
  );
}
