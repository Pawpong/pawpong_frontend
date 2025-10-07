import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function SignupFormTitle({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-span-(--default-span) flex justify-center text-heading-2 font-semibold text-primary",
        className
      )}
      {...props}
    ></div>
  );
}
