import { cn } from '@/lib/utils';

export default function Container({
  wrapperClassName,
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  wrapperClassName?: string;
  variant?: 'default' | 'tertiary';
}) {
  return (
    <div className={cn('flex', { 'bg-tertiary-500': variant === 'tertiary' }, wrapperClassName)}>
      <div className={cn('m-auto w-full max-w-360 lg:px-12 md:px-10 px-5', className)} {...props} />
    </div>
  );
}
