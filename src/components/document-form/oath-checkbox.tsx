"use client";

import OathDialogTrigger from "@/app/signup/_components/oath-dialog-trigger";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight } from "lucide-react";
import { type Level } from "./document-constants";

interface OathCheckboxProps {
  level: Level;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function OathCheckbox({
  level,
  checked,
  onCheckedChange,
}: OathCheckboxProps) {
  return (
    <OathDialogTrigger
      className="cursor-pointer"
      onAgree={() => {
        onCheckedChange(true);
      }}
      asChild
      level={level}
    >
      <div className="flex items-center">
        <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
          <div className="size-5 flex items-center justify-center">
            <Checkbox
              checked={checked}
              onClick={(e) => {
                if (checked === true) {
                  e.stopPropagation();
                  onCheckedChange(false);
                }
              }}
            />
          </div>
          <span className="text-body-xs text-grayscale-gray6 select-none">
            (필수) {level === "elite" ? "엘리트" : "뉴"} 레벨 브리더 입점 서약서
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
    </OathDialogTrigger>
  );
}

