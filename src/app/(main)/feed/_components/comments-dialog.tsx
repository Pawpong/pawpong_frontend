'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideoComments, useCreateComment } from '../_hooks/use-feed';

interface CommentsDialogProps {
  videoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 비디오 댓글 모달
 */
export function CommentsDialog({ videoId, isOpen, onClose }: CommentsDialogProps) {
  const [commentText, setCommentText] = useState('');
  const { data: commentsData, isLoading } = useVideoComments(videoId || '', 1, 20);
  const createComment = useCreateComment();

  const handleSubmitComment = async () => {
    if (!videoId || !commentText.trim()) return;

    try {
      await createComment.mutateAsync({
        videoId,
        content: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b border-[#e1e1e1]">
          <DialogTitle className="text-lg font-bold text-[#4f3b2e]">댓글</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-[#f6f6ea] transition-colors"
          >
            <X className="h-5 w-5 text-[#4f3b2e]" />
          </button>
        </DialogHeader>

        {/* 댓글 목록 */}
        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            // 로딩 스켈레톤
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <Skeleton className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f6f6ea] to-[#e1e1e1]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                    <Skeleton className="h-4 w-full bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                  </div>
                </div>
              ))}
            </div>
          ) : !commentsData?.data?.items || commentsData.data.items.length === 0 ? (
            // 댓글 없음
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-[#f6f6ea] rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-[#4f3b2e]" />
              </div>
              <p className="text-sm font-medium text-[#4f3b2e]">첫 댓글을 남겨보세요!</p>
              <p className="text-xs text-[#888] mt-1">생각을 공유해주세요 🐾</p>
            </div>
          ) : (
            // 댓글 목록
            <div className="space-y-5">
              {commentsData?.data.items.map((comment) => (
                <div key={comment._id} className="flex gap-3 hover:bg-[#fafafa] p-2 rounded-lg transition-colors">
                  <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-[#4f3b2e]">
                    <AvatarImage src={comment.userProfileImage} alt={comment.userName} />
                    <AvatarFallback className="bg-[#f6f6ea] text-[#4f3b2e] font-bold">
                      {comment.userName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-[#4f3b2e]">{comment.userName}</span>
                      <span className="text-xs text-[#888]">
                        {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-[#3c3c3c] leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* 댓글 입력 */}
        <div className="px-6 py-4 border-t border-[#e1e1e1] bg-[#fafafa]">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-5 py-3 text-sm bg-white border-2 border-[#e1e1e1] rounded-full focus:outline-none focus:border-[#4f3b2e] transition-colors placeholder:text-[#a0a0a0]"
              disabled={createComment.isPending}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || createComment.isPending}
              size="icon"
              className="rounded-full h-12 w-12 bg-[#4f3b2e] hover:bg-[#3f2f25] disabled:bg-[#cccccc] transition-colors"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
