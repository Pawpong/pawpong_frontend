'use client';

import Pencil from '@/assets/icons/pencil.svg';
import Trash from '@/assets/icons/trash-1.svg';
import { Button } from '@/components/ui/button';

interface InquiryDetailActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InquiryDetailActions({ onEdit, onDelete }: InquiryDetailActionsProps) {
  return (
    <div className="flex gap-2 items-center shrink-0">
      {onEdit && (
        <Button
          type="button"
          variant="secondary"
          onClick={onEdit}
          className="gap-1.5 py-2 pl-3 pr-2"
        >
          수정
          <Pencil aria-hidden />
        </Button>
      )}
      {onDelete && (
        <Button
          type="button"
          variant="secondary"
          onClick={onDelete}
          className="gap-1.5 py-2 pl-3 pr-2"
        >
          삭제
          <Trash aria-hidden />
        </Button>
      )}
    </div>
  );
}
