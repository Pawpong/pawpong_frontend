'use client';

import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/api/utils';

interface AdBadgeProps {
  text?: string;
  popoverText?: string;
  className?: string;
}

export default function AdBadge({
  text = '광고',
  popoverText = '포퐁 광고 상품을 구매한 제휴 업체의 판매 상품입니다.',
  className,
}: AdBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div onClick={handleClick}>
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'h-auto px-[10px] py-[6px] rounded border border-[#E1E1E1] bg-white text-sm font-medium text-[#A0A0A0] cursor-pointer',
              className,
            )}
          >
            {text}
          </Badge>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="max-w-[240px] rounded border border-grayscale-gray2 bg-white px-2.5 py-1.5"
        >
          <p className="text-center text-sm font-medium leading-[1.25rem] text-[#A0A0A0]">{popoverText}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
