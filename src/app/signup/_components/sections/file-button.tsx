import FileIcon from "@/assets/icons/file";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

export default function FileButton({
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <Button variant="input" className="px-4 py-3" {...props}>
      <div className="gap-2 flex items-center">
        <FileIcon className="fill-transparent stroke-grayscale-gray5 size-5" />
        <div>{children}</div>
      </div>
    </Button>
  );
}
