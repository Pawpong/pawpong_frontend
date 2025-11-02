"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  placeholder: string;
  maxLength?: number;
  showLength?: boolean;
}

function Textarea({
  className,
  maxLength,
  showLength = true,
  ...props
}: TextareaProps) {
  const [value, setValue] = React.useState(
    props.value || props.defaultValue || ""
  );
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // textarea 높이 자동 조정
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    props.onChange?.(e);
  };

  // 초기 높이 설정
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="bg-white rounded-lg w-full relative overflow-hidden">
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "bg-transparent w-full min-h-[140px] h-auto px-4 pt-3 pb-8 text-body-s font-medium text-primary-500-basic placeholder:text-grayscale-gray5 focus:outline-none border-none resize-none overflow-hidden",
          className
        )}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {showLength && maxLength && (
        <div className="absolute bottom-3 right-4 text-[14px] font-medium leading-[20px] text-right pointer-events-none">
          <span className="text-[#4e9cf1]">{String(value).length}</span>
          <span className="text-grayscale-gray5">/{maxLength}</span>
        </div>
      )}
    </div>
  );
}

export { Textarea };
