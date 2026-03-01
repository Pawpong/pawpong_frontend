'use client';

import Sort from '@/assets/icons/sort';
import InquiriesFillIcon from '@/assets/icons/inquiries-fill.svg';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import type { InquirySortType } from '../_types/inquiry';
import InquiryWriteButton from './inquiry-write-button';

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
          <Button
            variant="ghost"
            className="gap-1 px-0 py-0 h-auto bg-transparent text-grayscale-gray6 text-body-xs font-medium [&_svg]:text-current hover:bg-transparent hover:text-grayscale-gray6 data-[state=open]:bg-transparent data-[state=open]:text-grayscale-gray6"
          >
            <Sort className="size-5" />
            {currentLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-[9.5625rem] bg-white rounded-[4px] p-1 shadow-[0px_0px_13px_0px_rgba(12,17,29,0.08)] min-w-0 border-0"
        >
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onSortChange(opt.value)}
              className="px-2.5 py-2 text-body-xs font-medium text-grayscale-gray6 rounded-[4px] hover:bg-tertiary-500 focus:bg-tertiary-500 focus:text-grayscale-gray6"
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
        <InquiryWriteButton />
      </div>
    </div>
  );
}
