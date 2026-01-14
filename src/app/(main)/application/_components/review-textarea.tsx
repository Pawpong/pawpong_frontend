import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ReviewTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
}

export default function ReviewTextarea({
  value,
  onChange,
  placeholder,
  maxLength = 800,
}: ReviewTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="bg-white flex flex-col items-start rounded-lg w-full">
      <div className="box-border flex flex-col gap-[var(--space-16)] items-start pb-0 pt-[var(--space-12)] px-[var(--space-16)] relative w-full">
        <Textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          showLength={false}
          currentLength={value.length}
          className="min-h-[140px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-body-xs placeholder:text-grayscale-gray5"
        />
      </div>
      <div className="bg-white box-border flex gap-[10px] items-center justify-end pb-[var(--space-12)] pt-[var(--space-16)] px-[var(--space-16)] relative rounded-bl-lg rounded-br-lg shrink-0 w-full min-h-[44px]">
        <p
          className={`text-[14px] font-medium text-grayscale-gray5 text-right leading-[20px] ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-[#4e9cf1]">{value.length}</span>
          /{maxLength}
        </p>
      </div>
    </div>
  );
}
