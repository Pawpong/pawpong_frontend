"use client";

import Close from "@/assets/icons/close";
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
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAllDistricts, type District } from "@/lib/districts";

export default function LocationSelectDialogTrigger({
  onSubmitLocation,
  ...props
}: { onSubmitLocation: (value: string | null) => void } & React.ComponentProps<
  typeof DialogTrigger
>) {
  const isMobile = useBreakpoint("md") === false;
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // API에서 지역 데이터 가져오기
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await getAllDistricts();
        setDistricts(data);
        if (data.length > 0) {
          setSelectedGroup(data[0].city);
        }
      } catch (error) {
        console.error("지역 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const onSelect = (value: string | null) => {
    setSelected(value);
  };
  if (loading) {
    return (
      <LargeDialog>
        <LargeDialogTrigger {...props} />
        <LargeDialogContent className="h-full md:size-150">
          <div className="flex items-center justify-center h-full">
            <p className="text-grayscale-gray5">지역 데이터 로딩 중...</p>
          </div>
        </LargeDialogContent>
      </LargeDialog>
    );
  }

  const currentDistrict = districts.find((d) => d.city === selectedGroup);

  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="h-full md:size-150">
        <LargeDialogHeader className="p-0 md:pt-6 md:px-6 md:pb-2.5 gap-0">
          <LargeDialogTitle className="py-4 px-padding md:p-0">
            <div className="flex justify-between items-center">
              지역
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
                {districts.map(({ city }) => (
                  <Button
                    variant={"ghost"}
                    key={city}
                    className={cn(
                      "flex-col gap-2 p-0 text-grayscale-gray5 font-semibold text-body-m",
                      {
                        "text-primary": selectedGroup === city,
                      }
                    )}
                    onClick={() => setSelectedGroup(city)}
                  >
                    {city}
                    <div
                      className={cn("h-0.5 w-full bg-transparent", {
                        "bg-primary-500": selectedGroup === city,
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
                {districts.map(({ city }) => (
                  <Button
                    key={city}
                    variant={"category"}
                    className={cn("py-2 px-2.5", {
                      "bg-[#F6F6EA]": selectedGroup === city,
                    })}
                    onClick={() => setSelectedGroup(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
          <ScrollArea className={cn("w-38.25 md:w-auto h-full", "flex-1")}>
            <div
              className={cn("flex-shrink-0 py-2 pl-3.5 pr-3", " pl-5 pr-3.5")}
            >
              {currentDistrict?.districts.map((district) => (
                <Label
                  key={district}
                  className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-center"
                >
                  <Checkbox
                    checked={selected === `${selectedGroup} ${district}`}
                    onCheckedChange={(checked) =>
                      onSelect(checked ? `${selectedGroup} ${district}` : null)
                    }
                  />
                  <div className="whitespace-wrap">{district}</div>
                </Label>
              ))}
            </div>
          </ScrollArea>
        </div>
        <LargeDialogFooter>
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%]  bg-[#A0C8F4] w-18 text-primary-500!"
              onClick={() => onSubmitLocation(selected)}
            >
              입력
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
