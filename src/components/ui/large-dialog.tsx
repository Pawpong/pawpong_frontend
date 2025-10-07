"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/lib/utils";
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
} from "./dialog";

function LargeDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <Dialog {...props} />;
}

function LargeDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogTrigger {...props} />;
}

function LargeDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPortal {...props} />;
}

function LargeDialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogClose {...props} />;
}

function LargeDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
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
        "max-w-150 rounded-[--spacing(4)] p-0 gap-0 max-h-full flex flex-col",
        className
      )}
    >
      {children}
    </DialogContent>
  );
}

function LargeDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DialogHeader
      className={cn("text-left gap-1.5 pt-6 px-6 pb-2.5 border-b ", className)}
      {...props}
    >
      {props.children}
    </DialogHeader>
  );
}

function LargeDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DialogFooter
      className={cn(
        "flex justify-end gap-2 pt-4 px-6 pb-6 border-t",
        className
      )}
      {...props}
    />
  );
}

function LargeDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogTitle className={cn("text-body-l", className)} {...props} />;
}

function LargeDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogDescription className={cn("text-body-s", className)} {...props} />
  );
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
