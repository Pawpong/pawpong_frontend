"use client";

import FileIcon from "@/assets/icons/file";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps, useRef, useState } from "react";

interface FileButtonProps extends ComponentProps<"button"> {
  onUpload?: (file: File) => void;
}

export default function FileButton({
  children,
  className,
  onUpload,
  ...props
}: FileButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    onUpload?.(file); // ✅ 외부에서 제어 가능
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
      <Button
        variant="input"
        type="button"
        onClick={handleClick}
        className={cn("px-4 py-3 flex items-center justify-between", className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          <FileIcon className="fill-transparent stroke-grayscale-gray5 size-5" />
          <div>{children}</div>
        </div>
        {fileName && (
          <div className="text-caption-s text-grayscale-gray5 truncate max-w-[50%] text-right">
            {fileName}
          </div>
        )}
      </Button>
    </div>
  );
}
