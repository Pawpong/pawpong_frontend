'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from '@/api/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';

function LargeDialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <Dialog {...props} />;
}

function LargeDialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogTrigger {...props} />;
}

function LargeDialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPortal {...props} />;
}

function LargeDialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogClose {...props} />;
}

function LargeDialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <LargeDialogOverlay className={cn(className)} {...props} />;
}

function LargeDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  hasChange?: boolean;
}) {
  return (
    <DialogContent
      {...props}
      showCloseButton={false}
      className={cn(
        'max-w-150 rounded-none sm:rounded-[--spacing(4)] p-0 gap-0 h-full w-full md:w-full md:max-w-150 md:h-auto md:max-h-[600px] flex flex-col',
        className,
      )}
    >
      {children}
    </DialogContent>
  );
}

function LargeDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <DialogHeader
      className={cn('text-left gap-1.5 border-b py-4 px-5 md:pt-6 md:px-6 md:pb-2.5', className)}
      {...props}
    >
      {props.children}
    </DialogHeader>
  );
}

function LargeDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <DialogFooter
      className={cn('flex justify-between gap-2 border-t py-4 px-5 md:pt-4 md:px-6 md:pb-6', className)}
      {...props}
    >
      {props.children}
    </DialogFooter>
  );
}

function LargeDialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogTitle className={cn('text-body-l', className)} {...props} />;
}

function LargeDialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogDescription className={cn('text-body-s', className)} {...props} />;
}

export {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogDescription,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogOverlay,
  LargeDialogPortal,
  LargeDialogTitle,
  LargeDialogTrigger,
};
