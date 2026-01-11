import { cn } from '@/api/utils';

export default function CircleBadge({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('size-1 bg-secondary-700 rounded-full', className)} {...props} />;
}
