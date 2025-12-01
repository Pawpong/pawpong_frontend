import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useSegment } from "@/hooks/use-segment";
import { cn } from "@/lib/utils";
import { findParentAndChildren, useFilterStore } from "@/stores/filter-store";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useEffect, useState } from "react";
import ClearFilters from "../filter-sidebar/clear-filters";
import CurrentFilters from "../filter-sidebar/current-filters";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useAllFiltersData } from "@/app/(main)/explore/_hooks/use-filter-data";

// Filter 타입 정의
type Filter = {
  label: string;
  value?: string;
  children?: Filter[];
};

export default function FilterDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const animal = (useSegment(1) as "cat" | "dog") || "cat";
  const [isOpen, setIsOpen] = useState(false);

  // 더보기 눌렀을 때만 API 호출 (모달이 열렸을 때만)
  const { data: apiFilters, isLoading, error } = useAllFiltersData(animal, isOpen);

  // 로딩이 완료될 때까지 빈 배열 사용
  const rootFilters = apiFilters || [];

  // 스토어에서 모든 상태와 액션을 가져옵니다.
  const tempSelectedLeaves = useFilterStore((e) => e.tempSelectedLeaves);
  const selectionPath = useFilterStore((e) => e.selectionPath);
  const initModalState = useFilterStore((e) => e.initModalState);
  const resetModalState = useFilterStore((e) => e.resetModalState);
  const selectPath = useFilterStore((e) => e.selectPath);
  const selectTempLeaf = useFilterStore((e) => e.selectTempLeaf);
  const selectAllTempLeaves = useFilterStore((e) => e.selectAllTempLeaves);
  const applyTempFilters = useFilterStore((e) => e.applyTempFilters);
  const clearTempFilters = useFilterStore((e) => e.clearTempFilters);
  const activeFilters = useFilterStore((e) => e.activeFilters);
  const setRootFilters = useFilterStore((e) => e.setRootFilters);
  const isMobile = useBreakpoint("md") === false;

  // animal이 변경되면 모달 상태 초기화
  useEffect(() => {
    resetModalState();
  }, [animal, resetModalState]);

  // rootFilters가 처음 로드되었을 때만 첫 번째 필터 선택
  useEffect(() => {
    if (
      !isLoading &&
      !error &&
      rootFilters.length > 0 &&
      selectionPath.length === 0
    ) {
      // API 필터를 store에 저장
      setRootFilters(rootFilters);
      selectPath(rootFilters[0], 0);
    }
  }, [rootFilters.length, selectionPath.length, isLoading, error, setRootFilters]);

  const handleApplyAndClose = () => {
    applyTempFilters();
  };

  const isSelected = (item: Filter, columnIndex: number) => {
    return selectionPath[columnIndex]?.label === item.label;
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          initModalState();
        } else {
          // 모달이 닫힐 때 (X 버튼이든 설정 버튼이든) 필터 적용
          applyTempFilters();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger {...props} />
      <DialogContent
        className="p-0 gap-0  flex flex-col w-full rounded-none md:rounded-lg h-full md:w-150 md:h-150"
        hasChange={activeFilters.length > 0}
      >
        <DialogHeader className="py-4 px-5 md:pt-6 md:px-6 pb-2.5 h-17 flex items-center flex-row">
          <DialogTitle>상세 필터</DialogTitle>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {isMobile && (
          <div className="px-5 flex gap-4">
            {rootFilters.map((filterGroup) => {
              const isTabSelected =
                selectionPath[0]?.label === filterGroup.label;

              return (
                <Button
                  variant="text"
                  key={filterGroup.label}
                  className={cn(
                    "text-body-m font-semibold flex flex-col gap-1.5 py-0 px-0",
                    { "text-primary!": isTabSelected }
                  )}
                  // --- 수정: 모바일 탭 클릭 이벤트 복구 ---
                  onClick={() => selectPath(filterGroup, 0)}
                >
                  {filterGroup.label}
                  <div
                    className={cn("h-0.5 w-full bg-transparent", {
                      "bg-primary-500": isTabSelected,
                    })}
                  />
                </Button>
              );
            })}
          </div>
        )}
        {!isMobile && tempSelectedLeaves.length > 0 && (
          <div className="pt-1.5 px-6 pb-5">
            <CurrentFilters
              selectedLeaves={tempSelectedLeaves}
              onRemove={(label) => selectTempLeaf(label, false, animal)}
            />
          </div>
        )}
        <Separator />

        {/* 로딩 상태 표시 */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-grayscale-500">필터 옵션을 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 표시 */}
        {error && !isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500">
              필터 옵션을 불러오는 데 실패했습니다.
            </div>
          </div>
        )}

        {/* 필터 데이터가 있을 때만 렌더링 */}
        {!isLoading && !error && rootFilters.length > 0 && (
          <div className="flex flex-1 min-h-0 h-full ">
            {/* ... 왼쪽 컬럼 ... */}
            {!isMobile && (
              <ScrollArea className="h-full border-r">
                <div className="flex-shrink-0 py-2 pl-3.5 pr-3">
                  {rootFilters.map((filterGroup) => (
                    <Button
                      key={filterGroup.label}
                      variant={"category"}
                      className={cn("py-2 px-2.5", {
                        "bg-[#F6F6EA]": isSelected(filterGroup, 0),
                      })}
                      onClick={() => selectPath(filterGroup, 0)}
                    >
                      {filterGroup.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}

            {selectionPath.map((selectedItem, index) => {
              if (!selectedItem.children || selectedItem.children.length === 0)
                return null;

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
                    {index === 1 && isLeafColumn && (
                      <>
                        <Label
                          key="select-all"
                          className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-center"
                        >
                          <Checkbox
                            checked={(() => {
                              if (tempSelectedLeaves.includes(selectedItem.label))
                                return true;

                              return false;
                            })()}
                            onCheckedChange={(checked) =>
                              selectAllTempLeaves(selectedItem, !!checked)
                            }
                          />

                          <div className="whitespace-wrap">모두 선택</div>
                        </Label>
                      </>
                    )}
                    {selectedItem.children.map((childItem) => {
                      if (!isLeafColumn) {
                        return (
                          <Button
                            onClick={() => selectPath(childItem, index + 1)}
                            key={childItem.label}
                            variant={"category"}
                            className={cn("py-2 px-2.5", {
                              "bg-[#F6F6EA]": isSelected(childItem, index + 1),
                            })}
                          >
                            {childItem.label}
                          </Button>
                        );
                      } else {
                        const parent = findParentAndChildren(
                          childItem.label,
                          rootFilters
                        ).parent;
                        const isChecked =
                          tempSelectedLeaves.includes(childItem.label) ||
                          (parent != null &&
                            tempSelectedLeaves.includes(parent.label));
                        return (
                          <Label
                            key={childItem.label}
                            className="py-2 pr-2.5 gap-2 text-body-xs text-grayscale-gray6 flex items-center"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                selectTempLeaf(childItem.label, !!checked, animal)
                              }
                            />
                            <div className="whitespace-wrap">
                              {childItem.label}
                            </div>
                          </Label>
                        );
                      }
                    })}
                  </div>
                </ScrollArea>
              );
            })}
          </div>
        )}

        <DialogFooter className="pt-0 px-0 md:py-auto flex border-t flex-col">
          {isMobile && tempSelectedLeaves.length > 0 && (
            <div className="relative w-full">
              <ScrollArea className="pt-3 pb-1.5 w-full">
                <CurrentFilters
                  className="flex-nowrap px-5"
                  selectedLeaves={tempSelectedLeaves}
                  onRemove={(label) => selectTempLeaf(label, false, animal)}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* 오른쪽 블러 오버레이 */}
              <div
                className="pointer-events-none absolute top-0 right-0 h-full w-5
                  bg-gradient-to-l from-white to-transparent"
              />
            </div>
          )}
          <div className="flex row justify-between items-center py-4 md:pt-4 md:pb-6 md:py-0 px-5">
            <ClearFilters onClick={clearTempFilters} />
            <DialogClose asChild>
              <Button
                onClick={handleApplyAndClose}
                className="rounded-[--spacing(1)] py-2 px-4 text-sm leading-[140%] tracking-[-2%] w-18 text-white!"
                type="submit"
              >
                설정
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
