"use client";

import Close from "@/assets/icons/close";
import ClearFilters from "@/components/filter-sidebar/clear-filters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "@/components/ui/large-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { catBreedFilters, dogBreedFilters } from "@/constants/filter";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { Animal } from "@/stores/signup-form-store";
import { useState } from "react";

export default function BreedsSelectDialogTrigger({
  animal,
  onSubmitBreeds,
  ...props
}: {
  animal: Animal;
  onSubmitBreeds: (value: string[]) => void;
} & React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useBreakpoint("md") === false;
  const animalFilter = animal === "dog" ? dogBreedFilters : catBreedFilters;
  const [selectedGroup, setSelectedGroup] = useState(
    animalFilter.children![0].label
  );
  const [selected, setSelected] = useState<string[]>([]);

  const clearActiveFilters = () => {
    setSelected([]);
  };

  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="h-full md:size-150">
        <LargeDialogHeader className="p-0 md:pt-6 md:px-6 md:pb-2.5 gap-0">
          <LargeDialogTitle className="py-4 px-padding md:p-0">
            <div className="flex justify-between items-center">
              품종
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray-7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
          {isMobile && (
            <div className="overflow-auto w-full">
              <div className="flex gap-4 px-padding">
                {animalFilter.children!.map(({ label }) => (
                  <Button
                    variant={"ghost"}
                    key={label}
                    className={cn(
                      "flex-col gap-2 p-0 text-grayscale-gray5 font-semibold text-body-m",
                      {
                        "text-primary": selectedGroup === label,
                      }
                    )}
                    onClick={() => setSelectedGroup(label)}
                  >
                    {label}
                    <div
                      className={cn("h-0.5 w-full bg-transparent", {
                        "bg-primary": selectedGroup === label,
                      })}
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </LargeDialogHeader>
        <div className="flex flex-1 min-h-0 h-full ">
          {/* 그룹 컬럼 */}
          {!isMobile && (
            <ScrollArea className="h-full border-r">
              <div className="flex-shrink-0 py-2 pl-3.5 pr-3">
                {animalFilter.children!.map(({ label }) => (
                  <Button
                    key={label}
                    variant={"category"}
                    className={cn("py-2 px-2.5", {
                      "bg-[#F6F6EA]": selectedGroup === label,
                    })}
                    onClick={() => {
                      setSelectedGroup(label);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
          <ScrollArea className={cn("w-38.25 md:w-auto h-full", "flex-1")}>
            <div
              className={cn("flex-shrink-0 py-2 pl-3.5 pr-3", " pl-5 pr-3.5")}
            >
              {animalFilter
                .children!.find((item) => item.label === selectedGroup)!
                .children!.map((childItem) => (
                  <Label
                    key={childItem.label}
                    className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-center"
                  >
                    <Checkbox
                      checked={selected.includes(childItem.label)}
                      onCheckedChange={() =>
                        setSelected((prev) => {
                          const isSelected = prev.includes(childItem.label);
                          if (isSelected) {
                            // 이미 선택된 항목이면 제거
                            return prev.filter(
                              (item) => item !== childItem.label
                            );
                          } else {
                            // 새로 선택하려는 항목이 5개 이상이면 막기
                            if (prev.length >= 5) {
                              // alert 대신 그냥 무시 가능
                              return prev;
                            }
                            return [...prev, childItem.label];
                          }
                        })
                      }
                    />

                    <div className="whitespace-wrap">{childItem.label}</div>
                  </Label>
                ))}
            </div>
          </ScrollArea>
        </div>
        <LargeDialogFooter>
          <ClearFilters onClick={clearActiveFilters} />
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] bg-[#A0C8F4] w-18 text-primary-500!"
              onClick={() => onSubmitBreeds(selected)}
            >
              입력
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
