import { cn } from "@/lib/utils";
import React from "react";

export default function GridContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "m-auto w-full grid grid-cols-5 md:grid-cols-8 gap-x-gutter lg:grid-cols-6",
        className
      )}
      {...props}
    />
  );
}
