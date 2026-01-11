import * as React from 'react';

import { cn } from '@/api/utils';

function Input({ className, placeholder, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-grayscale-gray4 selection:bg-primary-500 selection:text-primary-foreground bg-white text-color-primary-500-basic w-full min-w-0 rounded-[--spacing(2)]  px-4 py-3 text-body-s  outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm font-medium file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ',
        'focus-visible:ring-0',
        // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // 자동완성 배경색 제거
        '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_white_inset]',
        '[&:-webkit-autofill]:[-webkit-text-fill-color:#4F3B2E]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
