'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/api/utils';

interface BreedAdInfoProps {
  breed: string;
  className?: string;
}

export default function BreedAdInfo({ breed, className }: BreedAdInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn('relative flex items-center gap-[8px]', className)}>
      <div className="rounded bg-tertiary-500 py-1.5 px-2.5 w-fit text-body-xs font-medium text-primary-500">
        {breed}
      </div>
      <Badge
        variant="outline"
        className="h-auto px-[10px] py-[6px] rounded border border-[#E1E1E1] bg-white text-sm font-medium text-[#A0A0A0] cursor-pointer"
        onClick={handleToggle}
      >
        광고
      </Badge>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 max-w-[240px] rounded border border-grayscale-gray2 bg-white px-2.5 py-1.5">
          <p className="text-center text-sm font-medium leading-[1.25rem] text-[#A0A0A0]">
            포퐁 광고 상품을 구매한 제휴 업체의 판매 상품입니다.
          </p>
        </div>
      )}
    </div>
  );
}
