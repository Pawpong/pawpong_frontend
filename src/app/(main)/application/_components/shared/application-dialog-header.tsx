'use client';

import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Close from '@/assets/icons/close';

/**
 * 신청 상세 모달의 공통 헤더 컴포넌트
 * Figma 디자인에 맞춘 흰색 헤더 with 닫기 버튼
 */
export function ApplicationDialogHeader() {
  return (
    <div className="bg-white flex gap-1 items-center justify-end px-6 pt-6 pb-[10px] rounded-t-none md:rounded-t-2xl shrink-0">
      <DialogClose asChild>
        <Button variant="secondary" size="icon" className="bg-[#F6F6EA] hover:bg-[#F6F6EA]/80 size-9">
          <Close className="size-7" />
        </Button>
      </DialogClose>
    </div>
  );
}
