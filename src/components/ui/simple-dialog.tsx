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

function SimpleDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <Dialog {...props} />;
}

function SimpleDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogTrigger {...props} />;
}

function SimpleDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPortal {...props} />;
}

function SimpleDialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogClose {...props} />;
}

function SimpleDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <SimpleDialogOverlay className={cn(className)} {...props} />;
}

function SimpleDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  hasChange?: boolean;
}) {
  return (
    <DialogContent
      showCloseButton={false}
      {...props}
      className={cn("p-4 gap-8 max-w-90 rounded-[--spacing(4)]", className)}
    >
      {children}
    </DialogContent>
  );
}

function SimpleDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DialogHeader className={cn("text-center gap-1.5", className)} {...props} />
  );
}

function SimpleDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DialogFooter
      className={cn("grid grid-cols-2 gap-2", className)}
      {...props}
    />
  );
}

function SimpleDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogTitle className={cn("text-body-l", className)} {...props} />;
}

function SimpleDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogDescription className={cn("text-body-s", className)} {...props} />
  );
}

export {
  SimpleDialog,
  SimpleDialogClose,
  SimpleDialogContent,
  SimpleDialogDescription,
  SimpleDialogFooter,
  SimpleDialogHeader,
  SimpleDialogOverlay,
  SimpleDialogPortal,
  SimpleDialogTitle,
  SimpleDialogTrigger,
};
