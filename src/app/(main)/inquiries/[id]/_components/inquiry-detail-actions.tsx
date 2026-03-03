import Pencil from '@/assets/icons/pencil.svg';
import Trash from '@/assets/icons/trash.svg';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/confirm-dialog';

interface InquiryDetailActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  /** 삭제 확인 모달 제목용: 질문(글) / 답변 */
  deleteTarget?: 'question' | 'answer';
}

const DELETE_TITLES = {
  question: '작성한 질문을 삭제하시겠어요?',
  answer: '작성한 답변을 삭제하시겠어요?',
} as const;

export default function InquiryDetailActions({
  onEdit,
  onDelete,
  deleteTarget = 'question',
}: InquiryDetailActionsProps) {
  if (!onEdit && !onDelete) return null;

  return (
    <div className="flex gap-2">
      {onEdit && (
        <Button variant="secondary" onClick={onEdit} className="gap-1 py-2 pl-3 pr-2">
          수정
          <Pencil aria-hidden />
        </Button>
      )}
      {onDelete && (
        <ConfirmDialog
          onConfirm={onDelete}
          title={DELETE_TITLES[deleteTarget]}
          description="삭제한 내용은 복구할 수 없어요."
          confirmText="삭제"
          cancelText="취소"
        >
          <Button variant="secondary" className="gap-1 py-2 pl-3 pr-2">
            삭제
            <Trash aria-hidden />
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
}
