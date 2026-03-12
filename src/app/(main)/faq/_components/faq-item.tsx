'use client';

import { FaqDto } from '@/api/home';
import { cn } from '@/api/utils';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  item: FaqDto;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqItemComponent({ item, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="flex flex-col w-full">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-7 text-left bg-white"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-body-m font-medium text-primary-500 shrink-0">Q</span>
          <span className="text-body-m font-medium text-primary-500 break-words">{item.question}</span>
        </div>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-grayscale-gray5 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="bg-[#F6F6EA] px-[26px] py-7">
            <p className="text-body-s font-normal text-[#303339] leading-[1.5] whitespace-pre-line">{item.answer}</p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-[#E1E1E1]" />
    </div>
  );
}
