'use client';

import OathDialogTrigger from '@/app/signup/_components/oath-dialog-trigger';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/api/utils';
import { type Level } from './document-constants';

interface OathCheckboxProps {
  level: Level;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function OathCheckbox({ level, checked, onCheckedChange }: OathCheckboxProps) {
  // 팝업에서 한번 동의하면 Read-only 상태 (checked가 true이면 Read-only)
  const isReadOnly = checked;

  return (
    <OathDialogTrigger
      className="cursor-pointer"
      onAgree={() => {
        onCheckedChange(true);
      }}
      isReadOnly={isReadOnly}
      asChild
      level={level}
    >
      <div className="flex items-center">
        <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
          <div
            className="size-5 flex items-center justify-center"
            onClick={(e) => {
              // 체크박스 영역 클릭 시 팝업이 열리도록 이벤트 전파
              // Read-only 상태에서도 팝업은 열 수 있어야 함
            }}
          >
            <Checkbox
              checked={checked}
              disabled={isReadOnly}
              onClick={(e) => {
                // 체크박스 자체 클릭은 이벤트 전파 (팝업 열기)
                // Read-only 상태에서는 해제 불가능하므로 이벤트만 전파
                if (isReadOnly) {
                  return;
                }
              }}
              className={cn(isReadOnly && 'cursor-default')}
            />
          </div>
          <span className="text-body-xs text-grayscale-gray6 select-none">(필수) 브리더 입점 서약서</span>
        </div>

        <Button variant="ghost" className="flex items-center gap-2.5 text-grayscale-gray5 text-body-xs">
          <div>보기</div>
          <div className="size-5 flex items-center justify-center">
            <ChevronRight className="size-4" />
          </div>
        </Button>
      </div>
    </OathDialogTrigger>
  );
}
