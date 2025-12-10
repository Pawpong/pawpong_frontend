import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export default function SignupFormSection({ className, children }: ComponentProps<'div'>) {
  return <div className={cn(`flex flex-col gap-20 md:gap-25 lg:gap-30 w-full`, className)}>{children}</div>;
}
