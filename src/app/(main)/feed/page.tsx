'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFeedVideos } from './_hooks/use-feed';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, TrendingUp, Clock, Flame } from 'lucide-react';
import { dynamicClient } from '@/utils/dynamic-client';

const FeedVideoCard = dynamicClient(() => import('./_components/feed-video-card').then((mod) => mod.FeedVideoCard), {
  loading: () => <Skeleton className="w-full h-[520px] rounded-2xl" />,
});

const CommentsDialog = dynamicClient(() => import('./_components/comments-dialog').then((mod) => mod.CommentsDialog));

const TagSearchBar = dynamicClient(() => import('./_components/tag-search-bar').then((mod) => mod.TagSearchBar), {
  loading: () => <Skeleton className="w-full h-12 rounded-xl" />,
});

/**
 * Pawpong 피드 페이지
 */
export default function FeedPage() {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  const tagsQuery = selectedTags.length > 0 ? selectedTags.join(',') : undefined;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeedVideos(sortBy, tagsQuery);

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleCommentClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsCommentsDialogOpen(true);
  };

  const allVideos = data?.pages.flatMap((page) => page.data.items) ?? [];

  const sortOptions = [
    { value: 'latest', label: '최신', icon: Clock },
    { value: 'popular', label: '인기', icon: TrendingUp },
    { value: 'trending', label: '트렌딩', icon: Flame },
  ] as const;

  return (
    <div className="min-h-screen bg-[#fafafa] relative pb-20">
      {/* 배경 장식 효과 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] overflow-hidden">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-[#a0c8f4]/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-[#4f3b2e]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* 헤더 - Sticky with Glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-[#e1e1e1]/30 shadow-sm">
        <div className="max-w-[614px] mx-auto">
          {/* 타이틀 */}
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-3xl font-extrabold text-[#4f3b2e]">피드</h1>
          </div>

          {/* 정렬 탭 - Enhanced Design */}
          <div className="flex gap-0">
            {sortOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSortBy(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-300 relative group ${
                  sortBy === value
                    ? 'text-[#4f3b2e]'
                    : 'text-[#999] hover:text-[#4f3b2e] hover:bg-gradient-to-t hover:from-[#f6f6ea]/40 hover:to-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    sortBy === value ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                {label}
                {sortBy === value && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4f3b2e] rounded-t-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 태그 검색 - Enhanced Spacing */}
      <div className="max-w-[614px] mx-auto px-4 pt-6 pb-4 relative z-10">
        <TagSearchBar onTagSelect={handleTagToggle} selectedTags={selectedTags} />
      </div>

      {/* 비디오 피드 - Enhanced Card Design */}
      <div className="max-w-[614px] mx-auto bg-white rounded-2xl shadow-md border border-[#e1e1e1] overflow-hidden mb-20 relative z-10">
        {isLoading ? (
          // 로딩 스켈레톤 - Enhanced
          <div className="space-y-0">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-[#e1e1e1]/30 pb-4 last:border-b-0 animate-pulse">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f6f6ea] to-[#e1e1e1]" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                    <Skeleton className="h-3 w-16 bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                  </div>
                </div>
                <Skeleton className="w-full aspect-[4/5] bg-gradient-to-br from-[#f6f6ea] via-[#e8e8e0] to-[#e1e1e1]" />
                <div className="px-4 pt-3 space-y-2">
                  <Skeleton className="h-4 w-20 bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                  <Skeleton className="h-4 w-full bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                  <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-[#f6f6ea] to-[#e1e1e1]" />
                </div>
              </div>
            ))}
          </div>
        ) : allVideos.length === 0 ? (
          // 비디오 없음 - Enhanced
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#a0c8f4]/20 to-[#f6f6ea] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Clock className="w-10 h-10 text-[#4f3b2e]" />
            </div>
            <p className="text-xl font-bold text-[#4f3b2e] mb-3">표시할 비디오가 없습니다</p>
            <p className="text-sm text-[#888] max-w-xs">다른 필터를 시도하거나 나중에 다시 확인해주세요</p>
          </div>
        ) : (
          <>
            {/* 비디오 카드 목록 */}
            {allVideos.map((video, index) => (
              <div
                key={video._id}
                className="opacity-0 animate-fadeIn"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <FeedVideoCard video={video} onCommentClick={handleCommentClick} />
              </div>
            ))}

            {/* 무한 스크롤 트리거 */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-10">
                <div className="relative">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4f3b2e]" />
                  <div className="absolute inset-0 w-10 h-10 rounded-full bg-[#a0c8f4]/20 animate-ping" />
                </div>
              </div>
            )}

            {/* 모든 비디오 로딩 완료 */}
            {!hasNextPage && allVideos.length > 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-[#f6f6ea] rounded-full shadow-sm border border-[#e1e1e1]">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#4f3b2e] to-[#6b5547] animate-pulse" />
                  <p className="text-sm font-semibold text-[#4f3b2e]">모든 비디오를 확인했습니다</p>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#4f3b2e] to-[#6b5547] animate-pulse" />
                </div>
                <p className="text-xs text-[#888] mt-4">새로운 콘텐츠를 기다려주세요 🐾</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 댓글 모달 */}
      <CommentsDialog
        videoId={selectedVideoId}
        isOpen={isCommentsDialogOpen}
        onClose={() => {
          setIsCommentsDialogOpen(false);
          setSelectedVideoId(null);
        }}
      />
    </div>
  );
}
