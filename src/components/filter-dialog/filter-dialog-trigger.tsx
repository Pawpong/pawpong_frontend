import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { filter } from "@/constants/filter"; // 제공해주신 filter 데이터 경로
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useSegment } from "@/hooks/use-segment"; // URL 세그먼트 hook
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useCallback, useEffect, useState } from "react"; // useState, useEffect import
import ClearFilters from "../filter-sidebar/clear-filters";
import CurrentFilters from "../filter-sidebar/current-filters";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

// Filter 타입 정의 (만약 없다면 추가해주세요)
type Filter = {
  label: string;
  value?: string;
  children?: Filter[];
};

export default function FilterDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const animal = (useSegment(1) as "cat" | "dog") || "cat";

  const [selectionPath, setSelectionPath] = useState<Filter[]>([]);
  // 2. 체크박스로 선택된 leaf-node 항목들을 저장하는 state (신규 추가)
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>([]);

  const rootFilters = filter[animal];

  // animal 변경 시 모든 선택 초기화
  useEffect(() => {
    setSelectionPath([]);
    setSelectedLeaves([]);
  }, [animal]);

  // 중간 카테고리 선택 핸들러 (탐색용)
  const handleSelect = useCallback((item: Filter, columnIndex: number) => {
    // 함수형 업데이트를 사용하여 최신 상태를 기반으로 경로를 설정합니다.
    setSelectionPath((prevPath) => {
      const newPath = prevPath.slice(0, columnIndex);
      newPath.push(item);

      let currentItem = item;
      while (currentItem.children && currentItem.children.length > 0) {
        if (!currentItem.children[0].children) {
          break;
        }
        const nextItem = currentItem.children[0];
        newPath.push(nextItem);
        currentItem = nextItem;
      }
      return newPath;
    });
  }, []); // 종속성이 없으므로 함수는 재생성되지 않습니다.

  // 3. Leaf-node 체크박스 선택 핸들러
  const handleLeafSelect = (itemLabel: string) => {
    setSelectedLeaves((prev) => {
      const newArray = [...prev];
      if (newArray.includes(itemLabel)) {
        newArray.splice(newArray.indexOf(itemLabel), 1); // 이미 있으면 제거 (체크 해제)
      } else {
        newArray.push(itemLabel); // 없으면 추가 (체크)
      }
      return newArray;
    });
  };

  // 모든 필터 초기화 핸들러
  const handleClearFilters = () => {
    setSelectionPath([]);
    setSelectedLeaves([]);
  };

  // 4. 특정 항목이 현재 선택된 경로에 포함되어 있는지 확인하는 함수
  const isSelected = (item: Filter, columnIndex: number) => {
    return selectionPath[columnIndex]?.label === item.label;
  };

  // --- 추가된 로직: 끝 ---
  const isMobile = useBreakpoint("md") === false;
  useEffect(() => {
    setSelectedLeaves([]); // 체크박스 선택은 항상 초기화

    // 첫 번째 필터 그룹이 존재하면 자동으로 선택합니다.
    if (rootFilters && rootFilters.length > 0) {
      // handleSelect가 columnIndex 0부터 경로를 새로 생성하므로,
      // 별도의 setSelectionPath 초기화 없이 바로 호출합니다.
      handleSelect(rootFilters[0], 0);
    } else {
      // 필터 데이터가 없으면 경로를 비웁니다.
      setSelectionPath([]);
    }
    // `handleSelect`는 useCallback으로 감싸져 있어 안정적입니다.
  }, [animal, rootFilters, handleSelect]);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="p-0 gap-0  flex flex-col w-full rounded-none md:rounded-lg h-full md:w-150 md:h-150">
        <DialogHeader className="py-4 px-5 md:pt-6 md:px-6 pb-2.5 h-17 flex items-center flex-row">
          <DialogTitle>상세 필터</DialogTitle>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {isMobile && (
          <div className="px-5 flex gap-4">
            {rootFilters.map((filterGroup) => {
              // 현재 선택된 첫 번째 카테고리인지 확인합니다.
              const isTabSelected =
                selectionPath[0]?.label === filterGroup.label;

              return (
                <Button
                  variant="text"
                  key={filterGroup.label}
                  // 선택 여부에 따라 텍스트 색상을 변경합니다.
                  className={cn(
                    "text-body-m font-semibold flex flex-col gap-1.5 py-0 px-0",
                    { "text-primary!": isTabSelected }
                  )}
                  // 클릭 시 해당 카테고리를 선택하는 핸들러를 연결합니다.
                  onClick={() => handleSelect(filterGroup, 0)}
                >
                  {filterGroup.label}

                  <div
                    className={cn("h-0.5 w-full bg-transparent", {
                      "bg-primary": isTabSelected,
                    })}
                  />
                </Button>
              );
            })}
          </div>
        )}
        {!isMobile && selectedLeaves.length > 0 && (
          <div className="pt-1.5 px-6 pb-5">
            <CurrentFilters selectedLeaves={selectedLeaves} />
          </div>
        )}
        <Separator />

        <div className="flex flex-1 min-h-0 h-full ">
          {/* 첫 번째 컬럼 (기본 필터) */}
          {!isMobile && (
            <ScrollArea className="h-full border-r ">
              <div className="flex-shrink-0 py-2 pl-3.5 pr-3 ">
                {rootFilters.map((filterGroup) => (
                  <Button
                    key={filterGroup.label}
                    variant={"category"}
                    className={cn("py-2 px-2.5", {
                      "bg-[#F6F6EA]": isSelected(filterGroup, 0),
                    })}
                    onClick={() => handleSelect(filterGroup, 0)}
                  >
                    {filterGroup.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* 선택에 따라 동적으로 생성되는 다음 단계 컬럼들 */}
          {selectionPath.map((selectedItem, index) => {
            if (!selectedItem.children || selectedItem.children.length === 0)
              return null;

            // 현재 렌더링할 컬럼이 leaf-node를 포함하는지 확인
            const isLeafColumn = !selectedItem.children[0]?.children;
            return (
              <ScrollArea
                key={index}
                className={cn("w-38.25 md:w-auto h-full", {
                  "border-r": !isLeafColumn,
                  "flex-1": isLeafColumn,
                })}
              >
                <div
                  className={cn("flex-shrink-0 py-2 pl-3.5 pr-3", {
                    " pl-5 pr-3.5": isLeafColumn,
                  })}
                >
                  {selectedItem.children.map((childItem) =>
                    !isLeafColumn ? (
                      <Button
                        key={childItem.label}
                        variant={"category"}
                        className={cn("py-2 px-2.5", {
                          "bg-[#F6F6EA]": isSelected(childItem, index + 1),
                        })}
                        onClick={() => handleSelect(childItem, index + 1)}
                      >
                        {childItem.label}
                      </Button>
                    ) : (
                      <Label
                        key={childItem.label}
                        className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-start"
                        onClick={() => handleSelect(childItem, index + 1)}
                      >
                        <div className="size-5 flex items-center justify-center">
                          <Checkbox
                            checked={selectedLeaves.includes(childItem.label)}
                            onCheckedChange={() =>
                              handleLeafSelect(childItem.label)
                            }
                          />
                        </div>
                        <div className="whitespace-wrap">{childItem.label}</div>
                      </Label>
                    )
                  )}
                </div>
              </ScrollArea>
            );
          })}
        </div>
        <DialogFooter className="pt-0 px-5 md:py-auto  flex border-t flex-col">
          {isMobile && selectedLeaves.length > 0 && (
            <div className="pt-3 pb-1.5">
              <CurrentFilters selectedLeaves={selectedLeaves} />
            </div>
          )}
          <div className="flex row justify-between items-center py-4 md:pt-4 md:pb-6 md:py-0">
            <ClearFilters onClick={handleClearFilters} />
            <Button
              className="py-1.5 px-4 text-grayscale-white! w-16.5 text-sm leading-[140%] tracking-[-2%]"
              type="submit"
            >
              설정
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
