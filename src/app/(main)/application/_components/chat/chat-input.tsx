'use client';

import { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  onSend: (content: string) => Promise<void> | void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    await onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-white border-t border-grayscale-gray2 px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          disabled={disabled}
          rows={1}
          className="
            flex-1 resize-none overflow-hidden rounded-xl border border-grayscale-gray2 bg-grayscale-gray1
            px-4 py-2.5 text-body-s text-grayscale-gray7
            placeholder:text-grayscale-gray4
            focus:outline-none focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="
            shrink-0 h-10 px-4 rounded-xl
            bg-primary-500 text-white text-body-s font-medium
            hover:bg-primary-600 transition-colors
            disabled:bg-status-disabled disabled:text-grayscale-gray4 disabled:cursor-not-allowed
          "
        >
          전송
        </button>
      </div>
    </div>
  );
}
