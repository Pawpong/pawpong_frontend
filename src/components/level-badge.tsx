import Crown from '@/assets/icons/crown';
import Plant from '@/assets/icons/plant';
import { cn } from '@/lib/utils';

export default function LevelBadge({ level, className }: { level: 'elite' | 'new'; className?: string }) {
  const levelInfo = {
    elite: {
      name: 'Elite',
      color: 'bg-[var(--color-level-elite-100)] text-[var(--color-level-elite-500)]',
      icon: Crown,
    },
    new: {
      name: 'New',
      color: 'bg-[var(--color-level-new-100)] text-[var(--color-level-new-500)]',
      icon: Plant,
    },
  };
  const Icon = levelInfo[level].icon;
  return (
    <div className={cn('py-1.5 px-3 gap-1.5 rounded-full flex items-center w-fit', levelInfo[level].color, className)}>
      <Icon className="size-4" />
      <span
        className="text-[var(--Typo-Size-Caption)] leading-[var(--Typo-Line-height-Caption)] font-medium"
        style={{
          fontFamily: 'Pretendard',
          fontSize: 'var(--Typo-Size-Caption, 0.75rem)',
          lineHeight: 'var(--Typo-Line-height-Caption, 0.75rem)',
          fontWeight: 500,
        }}
      >
        {levelInfo[level].name}
      </span>
    </div>
  );
}
