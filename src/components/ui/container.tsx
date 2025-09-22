import { cn } from "@/lib/utils";

export default function Container({
  wrapperClassName,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("flex", wrapperClassName)}>
      <div
        className={cn(
          "m-auto w-full max-w-360 lg:px-12 md:px-8 px-5",
          className
        )}
        {...props}
      />
    </div>
  );
}
