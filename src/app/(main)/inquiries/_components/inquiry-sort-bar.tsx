'use client';

import Sort from '@/assets/icons/sort';
import InquiriesFillIcon from '@/assets/icons/inquiries-fill.svg';
import PencilPixcel from '@/assets/icons/pencil-pixcel.svg';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/api/utils';
import Link from 'next/link';
import type { InquirySortType } from '../_types/inquiry';

const SORT_OPTIONS: { value: InquirySortType; label: string }[] = [
  { value: 'latest_answer', label: '최신 답변순' },
  { value: 'latest', label: '최신순' },
  { value: 'most_viewed', label: '조회순' },
];

interface InquirySortBarProps {
  currentSort: InquirySortType;
  onSortChange: (sort: InquirySortType) => void;
}

export default function InquirySortBar({ currentSort, onSortChange }: InquirySortBarProps) {
  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ?? '최신 답변순';

  return (
    <div className="flex items-center justify-between w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="text" className="gap-1 -mx-3 -my-2">
            <Sort className="size-5" />
            {currentLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onSortChange(opt.value)}
              className={cn({ 'font-bold text-primary-500': opt.value === currentSort })}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-2 items-center">
        <Link href="/inquiries?tab=my">
          <Button variant="secondary" size="sm" className="h-9 pl-4 pr-3 gap-1 text-body-xs">
            내 질문
            <InquiriesFillIcon className="size-5 shrink-0" />
          </Button>
        </Link>
        <Link href="/inquiries/write">
          <Button variant="tertiary" size="sm" className="h-9 pl-4 pr-3 gap-1 text-body-xs">
            공통 질문 작성
            <PencilPixcel className="size-5 shrink-0" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
