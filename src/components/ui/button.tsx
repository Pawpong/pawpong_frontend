import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--spacing(2)] text-body-s font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-point-basic! hover:bg-primary-600 ",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-branding-bg border-[#EEEBDE] hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-branding-bg text-primary hover:bg-[#EEEBDE]",
        tertiary:
          "bg-secondary text-primary hover:bg-secondary-600 disabled:bg-status-disabled disabled:text-grayscale-gray4!",
        ghost: " hover:text-foreground!",
        link: "text-primary underline-offset-4 hover:underline",
        filter: "bg-point-basic text-[#4F3B2E] hover:bg-[#77B2F3]",
        text: "text-body-xs text-grayscale-gray5! hover:text-primary!",
        category:
          "text-body-xs text-grayscale-gray6! bg-transparent hover:bg-[#F6F6EA]! rounded-sm w-full md:w-40 shrink-0 flex justify-start whitespace-wrap",

        input:
          "bg-white text-grayscale-gray4 hover:bg-white/90 justify-between w-full ",
      },
      size: {
        default: "px-2.5 py-1.5 has-[>svg]:px-3",
        sm: "rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
