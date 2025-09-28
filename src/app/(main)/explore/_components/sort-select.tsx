"use client";

import Sort from "@/assets/icons/sort";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const sortItems = [
  { label: "최신등록순", value: "latest" },
  { label: "찜 많은 순", value: "most_liked" },
  { label: "리뷰 많은 순", value: "most_reviewed" },
  { label: "오름차순", value: "asc" },
  { label: "내림차순", value: "desc" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest"; // "sort" query 파라미터 값을 가져오고, 없으면 기본값 'latest'를 사용

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  const currentSortLabel =
    sortItems.find((item) => item.value === currentSort)?.label || "정렬";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="text" className="gap-1 -mx-3 -my-2">
          <Sort className="size-5" />
          {currentSortLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sortItems.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onSelect={() => handleSortChange(item.value)}
            className={cn({
              "font-bold text-primary": item.value === currentSort,
            })}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
