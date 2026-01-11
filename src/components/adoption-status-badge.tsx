import { cn } from '@/api/utils';

export type AdoptionStatus = 'available' | 'reserved' | 'completed';

interface BadgeAdoptionStatusProps {
  className?: string;
  status: AdoptionStatus;
}

const statusConfig = {
  available: {
    label: '입양 가능',
    bgColor: 'bg-[var(--color-secondary-500)]',
    textColor: 'text-[var(--color-primary-500)]',
  },
  reserved: {
    label: '예약중',
    bgColor: 'bg-[var(--color-status-warning-100)]',
    textColor: 'text-[var(--color-primary-500)]',
  },
  completed: {
    label: '입양 완료',
    bgColor: 'bg-[var(--color-grayscale-gray5)]',
    textColor: 'text-[var(--color-grayscale-white)]',
  },
};

const AdoptionStatusBadge = ({ className, status }: BadgeAdoptionStatusProps) => {
  const config = statusConfig[status];

  return (
    <div className={cn('inline-flex', className)}>
      <span
        className={cn(
          'px-[0.625rem] py-[0.375rem] rounded text-body-xs leading-[var(--Typo-Line-height-Body-XS)] font-medium',
          config.bgColor,
          config.textColor,
        )}
      >
        {config.label}
      </span>
    </div>
  );
};

export default AdoptionStatusBadge;
