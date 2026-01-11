'use client';
import { cn } from '@/api/utils';
import useSignupFormStore from '@/stores/signup-form-store';
import { ComponentProps } from 'react';
import { Button } from '../ui/button';

export default function UndoButton({ className, ...props }: ComponentProps<'button'>) {
  const prevFlowIndex = useSignupFormStore((e) => e.prevFlowIndex);
  return (
    <div className="flex justify-center">
      <Button
        onClick={prevFlowIndex}
        variant="link"
        className={cn(
          'text-sm text-grayscale-gray5 font-normal underline underline-offset-4 leading-[140%] tracking-[-2%] w-fit -my-1.5',
          className,
        )}
        {...props}
      >
        뒤로
      </Button>
    </div>
  );
}
