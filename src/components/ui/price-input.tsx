import * as React from "react";
import { cn } from "@/lib/utils";

interface PriceInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  className?: string;
}

export function PriceInput({
  className,
  placeholder = "0",
  ...props
}: PriceInputProps) {
  return (
    <div
      className={cn(
        "bg-white flex h-12 items-center overflow-hidden rounded-lg w-full",
        className
      )}
    >
      {/* Input 영역 */}
      <div className="flex gap-2.5 grow items-center justify-start min-h-px min-w-px pl-4 pr-3 py-3 relative shrink-0">
        <input
          type="text"
          placeholder={placeholder}
          data-slot="input"
          className="file:text-foreground placeholder:text-grayscale-gray4 selection:bg-primary selection:text-primary-foreground bg-transparent font-medium text-body-s outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 w-full"
          {...props}
        />
      </div>

      {/* "원" 표시 영역 */}
      <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-4 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
        <div className="flex flex-col font-medium justify-center relative shrink-0 text-grayscale-black text-body-s text-nowrap">
          <span className="leading-body-s whitespace-pre">원</span>
        </div>
      </div>
    </div>
  );
}
