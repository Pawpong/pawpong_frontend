"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  placeholder?: string;
  maxLength?: number;
  showLength?: boolean;
  currentLength?: number; // 외부에서 글자 수를 전달받을 수 있음
}

function Textarea({
  className,
  maxLength,
  showLength = true,
  value: controlledValue,
  onChange: controlledOnChange,
  currentLength,
  ...props
}: TextareaProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    props.defaultValue || ""
  );
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    controlledOnChange?.(e);
  };

  return (
    <div className="bg-white rounded-lg w-full relative overflow-hidden">
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "bg-transparent w-full min-h-[200px] h-auto px-4 pt-3 pb-8 text-body-s font-medium text-color-primary-500-basic placeholder:text-grayscale-gray5 focus:outline-none border-none resize-none overflow-hidden",
          className
        )}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {showLength && maxLength && (
        <div className="absolute bottom-3 right-4 text-[14px] font-medium leading-[20px] text-right pointer-events-none">
          <span className="text-[#4e9cf1]">
            {currentLength !== undefined
              ? currentLength
              : String(value || "").length}
          </span>
          <span className="text-grayscale-gray5">/{maxLength}</span>
        </div>
      )}
    </div>
  );
}

export { Textarea };
