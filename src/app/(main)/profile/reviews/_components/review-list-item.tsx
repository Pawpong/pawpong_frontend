'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Check from '@/assets/icons/check-default.svg';
import Pencil from '@/assets/icons/pencil.svg';
import SirenMuted from '@/assets/icons/siren-muted.svg';
import Close from '@/assets/icons/close-default.svg';
import Trash from '@/assets/icons/trash.svg';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import Image from 'next/image';
import ReportDialog from '@/components/report-dialog/report-dialog';
import ConfirmDialog from '@/components/confirm-dialog';
import { addReviewReply, updateReviewReply, deleteReviewReply } from '@/app/api/breeder-management';
import { useToast } from '@/hooks/use-toast';

interface ReviewListItemProps {
  review: {
    reviewId: string;
    adopterName: string;
    comment: string;
    petName?: string;
    isReported?: boolean;
    createdAt: string;
    formattedDate: string;
    reviewType: string;
    breederNickname?: string;
    breederProfileImage?: string | null;
    breedingPetType?: string;
    // 브리더 답글 관련 필드
    replyContent?: string;
    replyWrittenAt?: string;
    replyUpdatedAt?: string;
  };
}

export default function ReviewListItem({ review }: ReviewListItemProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  // 서버에서 받은 답글이 있으면 초기값으로 설정
  const [submittedReply, setSubmittedReply] = useState<string | null>(review.replyContent || null);
  const [replyDate, setReplyDate] = useState<string | null>(review.replyUpdatedAt || review.replyWrittenAt || null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드인지 여부
  const typeLabel = review.reviewType || '후기';

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  };

  // 답글 등록 mutation
  const addReplyMutation = useMutation({
    mutationFn: (content: string) => addReviewReply(review.reviewId, content),
    onSuccess: (data) => {
      setSubmittedReply(data.replyContent);
      setReplyDate(data.replyWrittenAt);
      setIsReplying(false);
      setReplyText('');
      toast({ title: '답글이 등록되었습니다.', position: 'default' });
      // 후기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['breeder-my-reviews'] });
    },
    onError: (error) => {
      console.error('답글 등록 실패:', error);
      toast({ title: '답글 등록에 실패했습니다.', position: 'default' });
    },
  });

  // 답글 수정 mutation
  const updateReplyMutation = useMutation({
    mutationFn: (content: string) => updateReviewReply(review.reviewId, content),
    onSuccess: (data) => {
      setSubmittedReply(data.replyContent);
      setReplyDate(data.replyUpdatedAt || data.replyWrittenAt);
      setIsReplying(false);
      setIsEditing(false);
      setReplyText('');
      toast({ title: '답글이 수정되었습니다.', position: 'default' });
      // 후기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['breeder-my-reviews'] });
    },
    onError: (error) => {
      console.error('답글 수정 실패:', error);
      toast({ title: '답글 수정에 실패했습니다.', position: 'default' });
    },
  });

  // 답글 삭제 mutation
  const deleteReplyMutation = useMutation({
    mutationFn: () => deleteReviewReply(review.reviewId),
    onSuccess: () => {
      setSubmittedReply(null);
      setReplyDate(null);
      setIsDeleteDialogOpen(false);
      toast({ title: '답글이 삭제되었습니다.', position: 'default' });
      // 후기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['breeder-my-reviews'] });
    },
    onError: (error) => {
      console.error('답글 삭제 실패:', error);
      toast({ title: '답글 삭제에 실패했습니다.', position: 'default' });
      setIsDeleteDialogOpen(false);
    },
  });

  const handleReplyClick = () => {
    setIsReplying(true);
    setIsEditing(false);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setIsEditing(false);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast({ title: '답글 내용을 입력해주세요.', position: 'default' });
      return;
    }

    if (isEditing) {
      // 수정 모드
      updateReplyMutation.mutate(replyText);
    } else {
      // 새 답글 등록
      addReplyMutation.mutate(replyText);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteReplyMutation.mutate();
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditReply = () => {
    if (submittedReply) {
      setReplyText(submittedReply);
      setIsReplying(true);
      setIsEditing(true);
    }
  };

  const isLoading = addReplyMutation.isPending || updateReplyMutation.isPending || deleteReplyMutation.isPending;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-body-s font-semibold text-grayscale-gray5">{review.adopterName || '익명'}</div>
            <div className="text-body-s text-grayscale-gray5">
              {typeLabel}・{review.formattedDate}
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-1 text-grayscale-gray5 text-body-xs px-0 has-[>svg]:px-0"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <SirenMuted className="size-5" />
            <div>신고하기</div>
          </Button>
        </div>
        <div className="font-medium text-body-m text-primary-500 break-all">{review.comment}</div>

        {/* 답글 작성 버튼 또는 답글 작성 폼 또는 제출된 답글 */}
        {submittedReply && !isReplying ? (
          // 제출된 답글 UI
          <div className="mt-2">
            <div className="flex gap-3">
              {/* 브리더 프로필 이미지 */}
              <div className="w-10 h-10 rounded-lg bg-grayscale-gray1 flex items-center justify-center shrink-0 overflow-hidden">
                {review.breederProfileImage ? (
                  <Image
                    src={review.breederProfileImage}
                    alt={review.breederNickname || '브리더'}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized={review.breederProfileImage.startsWith('http')}
                  />
                ) : (
                  (() => {
                    const petType = review.breedingPetType?.toLowerCase();
                    const IconComponent = petType === 'cat' ? Cat : Dog;
                    return <IconComponent className="w-6 h-6 text-grayscale-gray5" />;
                  })()
                )}
              </div>
              {/* 답글 내용 - gray-1 배경 */}
              <div className="flex-1 bg-grayscale-gray1 rounded-lg p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-body-m font-semibold text-primary-500">{review.breederNickname}</span>
                  <span className="text-body-s text-grayscale-gray5">{formatDate(replyDate)}</span>
                </div>
                <div className="text-body-m font-medium text-primary-500 break-all">{submittedReply}</div>
                {/* 버튼들 - 하단 */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="bg-white text-body-xs font-normal text-grayscale-gray6 gap-1 pt-2 pr-2 pb-2 pl-3 h-auto hover:bg-grayscale-gray2 border-0"
                    onClick={handleEditReply}
                    disabled={isLoading}
                  >
                    수정
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="bg-white text-body-xs font-normal text-grayscale-gray6 gap-1 pt-2 pr-2 pb-2 pl-3 h-auto hover:bg-grayscale-gray2 border-0"
                    onClick={handleDeleteClick}
                    disabled={isLoading}
                  >
                    삭제
                    <Trash className="text-grayscale-gray6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : !isReplying ? (
          // 답글 작성 버튼
          <div className="mt-2">
            <Button variant="secondary" className="px-0 py-2 pr-2 pl-3 gap-1 shrink-0" onClick={handleReplyClick}>
              <span className="text-body-xs font-normal text-grayscale-gray6">답글 작성</span>
              <Pencil className="size-4" />
            </Button>
          </div>
        ) : (
          // 답글 작성 폼
          <div className="mt-2">
            <div className="bg-grayscale-gray1 rounded-lg flex flex-col relative">
              {/* 텍스트 입력 영역 */}
              <div className="px-4 pt-3 pb-0">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="상담 및 입양 과정에 대한 감사 인사나 후기를 남겨주세요"
                  maxLength={800}
                  showLength={false}
                  currentLength={replyText.length}
                  wrapperClassName="bg-grayscale-gray1"
                  className="min-h-[120px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-body-xs placeholder:text-grayscale-gray5 resize-none"
                />
              </div>
              {/* 하단 영역: 문자 카운터 + 버튼 */}
              <div className="flex items-center justify-between px-4 pb-3 pt-2">
                {/* 문자 카운터 - 왼쪽 */}
                <div className="text-[14px] font-medium leading-[20px]">
                  <span className="text-[#4e9cf1]">{replyText.length}</span>
                  <span className="text-grayscale-gray5">/800</span>
                </div>
                {/* 버튼들 - 오른쪽 */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="bg-white text-body-xs text-grayscale-gray6 gap-1 px-3 py-2 h-auto hover:bg-grayscale-gray2 border-0"
                    onClick={handleCancelReply}
                    disabled={isLoading}
                  >
                    취소
                    <Close className="size-4" />
                  </Button>
                  <Button
                    variant="tertiary"
                    className="px-3 py-2 h-auto text-body-xs gap-1 text-grayscale-gray6 border-0"
                    onClick={handleSubmitReply}
                    disabled={isLoading}
                  >
                    {isLoading ? '처리중...' : isEditing ? '수정' : '등록'}
                    <Check className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        type="review"
        reviewId={review.reviewId}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="답글을 삭제할까요?"
        description="삭제한 답글은 복구할 수 없어요."
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
}
