import { cn } from "@/lib/utils";
import React from "react";

export default function SocialLoginIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("size-4", className)} {...props} />;
}
