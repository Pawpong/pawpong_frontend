'use client';

import { Button } from '@/components/ui/button';
import DownArrow from '@/assets/icons/long-down-arrow.svg';
import { cn } from '@/api/utils';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  variant?: 'default' | 'custom';
}

/**
 * 재사용 가능한 "더보기" 버튼 컴포넌트
 */
export default function LoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
  wrapperClassName,
  variant = 'default',
}: LoadMoreButtonProps) {
  const defaultButtonClassName =
    'bg-[var(--color-grayscale-gray1)] hover:bg-[var(--color-grayscale-gray2)] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50';
  const customButtonClassName =
    'bg-[#F5F5F5] hover:bg-[#EEEEEE] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50';

  const buttonClassName = variant === 'custom' ? customButtonClassName : defaultButtonClassName;
  const textClassName =
    variant === 'custom' ? 'text-body-s font-medium text-[#545454]' : 'text-body-s font-medium text-grayscale-gray6';

  return (
    <div className={cn('flex justify-center', wrapperClassName)}>
      <Button
        variant="ghost"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(buttonClassName, className)}
      >
        <span className={textClassName}>{isLoading ? '로딩 중...' : '더보기'}</span>
        <DownArrow />
      </Button>
    </div>
  );
}
