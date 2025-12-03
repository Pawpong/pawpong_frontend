"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEVEL_INFO, type Level } from "./document-constants";

interface LevelTabsProps {
  level: Level;
  onLevelChange: (level: Level) => void;
}

export default function LevelTabs({ level, onLevelChange }: LevelTabsProps) {
  return (
    <div className="flex gap-5 items-stretch w-full">
      {LEVEL_INFO.map(({ name, icon: Icon, label }) => (
        <Button
          key={name}
          variant="ghost"
          className={cn(
            "flex flex-col gap-2 bg-transparent p-0 text-grayscale-gray5 hover:text-grayscale-gray6! flex-1",
            {
              "text-primary-500": level === name,
            }
          )}
          onClick={() => onLevelChange(name)}
        >
          <div className="flex items-center gap-2 justify-center">
            <Icon className="size-7" />
            <div className="text-heading-3 font-semibold">{label}</div>
          </div>
          <div
            className={cn("h-0.5 w-full bg-transparent", {
              "bg-primary-500": level === name,
            })}
          />
        </Button>
      ))}
    </div>
  );
}
