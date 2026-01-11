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
      <div className="flex flex-col">
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
              isOpen ? 'rotate-180' : 'rotate-0',
            )}
          />
        </button>

        {isOpen && (
          <div className="bg-[#F6F6EA] px-[26px] py-7">
            <p className="text-body-s font-normal text-[#303339] leading-[1.5] whitespace-pre-line">{item.answer}</p>
          </div>
        )}
      </div>
      <div className="h-px w-full bg-[#E1E1E1]" />
    </div>
  );
}
