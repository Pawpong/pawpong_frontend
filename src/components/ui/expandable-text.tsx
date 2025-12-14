'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ExpandableTextProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string;

  gradientColor?: string; // ex) "white", "grayscale-gray1"
}

export function ExpandableText({
  data,
  className,

  gradientColor = 'white',
  ...props
}: ExpandableTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflow(el.scrollHeight > 200);
  }, [data]);

  return (
    <div>
      <div className={cn('relative w-full', className)} {...props}>
        {/* 텍스트 영역 */}
        <div
          ref={textRef}
          className={cn('overflow-hidden text-body-s text-primary transition-all')}
          style={expanded ? {} : { maxHeight: '200px' }}
        >
          {data}
        </div>

        {/* 더보기 버튼 + 그라데이션 */}
        {!expanded && overflow && (
          <>
            <div
              className="absolute bottom-0 left-0 w-full flex justify-center pt-6 pb-2"
              style={{
                height: '84px',
                background: `linear-gradient(to top, ${gradientColor}, rgba(255,255,255,0) 100%)`,
              }}
            ></div>
          </>
        )}

        {/* 접기 버튼 */}
      </div>

      {overflow && (
        !expanded ? (
          <Button
            className="p-0 pt-4 w-full flex items-center justify-center text-grayscale-gray5! hover:text-primary!"
            variant="ghost"
            onClick={() => setExpanded(true)}
          >
            <div className="flex items-center gap-1">
              <div>더보기</div>
              <ChevronDown className="size-3.5" />
            </div>
          </Button>
        ) : (
          <Button
            className="p-0 w-full pt-4 flex items-center justify-center text-grayscale-gray5! hover:text-primary!"
            variant="ghost"
            onClick={() => setExpanded(false)}
          >
            <div className="flex items-center gap-1">
              <div>접기</div>
              <ChevronUp className="size-3.5" />
            </div>
          </Button>
        )
      )}
    </div>
  );
}
