'use client';

import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InquiryDetailActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InquiryDetailActions({ onEdit, onDelete }: InquiryDetailActionsProps) {
  if (!onEdit && !onDelete) return null;

  return (
    <div className="flex gap-2">
      {onEdit && (
        <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1">
          수정
          <Pencil className="size-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="secondary" size="sm" onClick={onDelete} className="gap-1">
          삭제
          <Trash className="size-4" />
        </Button>
      )}
    </div>
  );
}
