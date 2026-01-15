import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFeedVideos,
  getPopularVideos,
  toggleVideoLike,
  getVideoComments,
  createVideoComment,
  searchTags,
  type FeedVideo,
} from '@/app/api/feed';

/**
 * 피드 비디오 목록 조회 훅 (무한 스크롤)
 */
export const useFeedVideos = (
  sortBy: 'latest' | 'popular' | 'trending' = 'latest',
  tags?: string,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: ['feed', 'videos', sortBy, tags],
    queryFn: ({ pageParam = 1 }) => getFeedVideos(pageParam, limit, sortBy, tags),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

/**
 * 인기 비디오 조회 훅
 */
export const usePopularVideos = (limit: number = 10) => {
  return useQuery({
    queryKey: ['feed', 'popular', limit],
    queryFn: () => getPopularVideos(limit),
  });
};

/**
 * 비디오 좋아요 토글 훅
 */
export const useToggleVideoLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => toggleVideoLike(videoId),
    onSuccess: (data, videoId) => {
      // 모든 피드 쿼리 캐시 업데이트
      const sortTypes = ['latest', 'popular', 'trending'];

      sortTypes.forEach((sortBy) => {
        queryClient.setQueryData(['feed', 'videos', sortBy, undefined], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((video: FeedVideo) =>
                  video._id === videoId
                    ? {
                        ...video,
                        isLiked: data.data.isLiked,
                        likeCount: data.data.likeCount,
                      }
                    : video,
                ),
              },
            })),
          };
        });
      });

      // 태그 필터링된 쿼리도 업데이트
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return key[0] === 'feed' && key[1] === 'videos';
        },
      });
    },
  });
};

/**
 * 비디오 댓글 목록 조회 훅
 */
export const useVideoComments = (videoId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['feed', 'comments', videoId, page],
    queryFn: () => getVideoComments(videoId, page, limit),
    enabled: !!videoId,
  });
};

/**
 * 댓글 작성 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, content }: { videoId: string; content: string }) => createVideoComment(videoId, content),
    onSuccess: (data, variables) => {
      // 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['feed', 'comments', variables.videoId],
      });

      // 모든 피드 비디오 댓글 수 증가
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return key[0] === 'feed' && key[1] === 'videos';
        },
      });

      // 특정 정렬 타입의 비디오 댓글 수 증가
      const sortTypes = ['latest', 'popular', 'trending'];
      sortTypes.forEach((sortBy) => {
        queryClient.setQueryData(['feed', 'videos', sortBy, undefined], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((video: FeedVideo) =>
                  video._id === variables.videoId
                    ? {
                        ...video,
                        commentCount: video.commentCount + 1,
                      }
                    : video,
                ),
              },
            })),
          };
        });
      });
    },
  });
};

/**
 * 태그 검색 훅
 */
export const useSearchTags = (query: string) => {
  return useQuery({
    queryKey: ['feed', 'tags', query],
    queryFn: () => searchTags(query),
    enabled: query.length > 0,
  });
};
