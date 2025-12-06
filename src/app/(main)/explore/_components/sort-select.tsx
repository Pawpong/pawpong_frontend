'use client';

import Sort from '@/assets/icons/sort';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSortOptions } from '../_hooks/use-filter-options';

export default function SortSelect() {
  // API에서 정렬 옵션 가져오기
  const { data: sortOptions, isLoading } = useSortOptions();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest'; // "sort" query 파라미터 값을 가져오고, 없으면 기본값 'latest'를 사용

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  // 로딩 중이거나 데이터가 없을 때 기본값 사용
  const sortItems = sortOptions || [];
  const currentSortLabel = sortItems.find((item) => item.value === currentSort)?.label || '정렬';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="text" className="gap-1 -mx-3 -my-2" disabled={isLoading}>
          <Sort className="size-5" />
          {isLoading ? '로딩 중...' : currentSortLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuItem disabled>
            <div className="text-gray-400 text-sm">로딩 중...</div>
          </DropdownMenuItem>
        ) : (
          sortItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onSelect={() => handleSortChange(item.value)}
              className={cn({
                'font-bold text-primary': item.value === currentSort,
              })}
            >
              {item.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
