import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

export default function NextButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      variant={"tertiary"}
      className={cn("py-3 px-4 w-full h-12", className)}
      {...props}
    >
      {props.children || "다음"}
    </Button>
  );
}
