import api from './api';

/**
 * 백엔드 응답 비디오 타입 (원본)
 */
interface BackendFeedVideo {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    viewCount: number;
    likeCount?: number;
    uploadedBy: {
        _id: string;
        name: string;
        profileImageFileName?: string;
        businessName?: string;
    };
    createdAt: string;
}

/**
 * Feed 비디오 타입 정의 (프론트엔드 사용)
 */
export interface FeedVideo {
    _id: string;
    uploaderId: string;
    uploaderName: string;
    uploaderProfileImage?: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    hlsUrl?: string;
    duration: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
}

/**
 * Feed 비디오 목록 응답 타입
 */
export interface FeedVideosResponse {
    success: boolean;
    code: number;
    data: {
        items: FeedVideo[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
    message?: string;
    timestamp: string;
}

/**
 * 댓글 타입 정의
 */
export interface FeedComment {
    _id: string;
    commentId: string;
    videoId: string;
    userId: string;
    userName: string;
    userProfileImage?: string;
    content: string;
    likeCount: number;
    replyCount: number;
    isOwner: boolean;
    createdAt: string;
    updatedAt?: string;
}

/**
 * 백엔드 댓글 응답 타입
 */
interface BackendComment {
    commentId: string;
    content: string;
    author: {
        _id: string;
        name: string;
        profileImageFileName?: string;
        businessName?: string;
    };
    parentId?: string;
    likeCount: number;
    replyCount: number;
    createdAt: string;
    isOwner: boolean;
}

/**
 * 댓글 목록 응답 타입
 */
export interface FeedCommentsResponse {
    success: boolean;
    code: number;
    data: {
        comments: BackendComment[];
        totalCount: number;
        hasNextPage: boolean;
    };
    message?: string;
    timestamp: string;
}

/**
 * 좋아요 응답 타입
 */
export interface LikeResponse {
    success: boolean;
    code: number;
    data: {
        videoId: string;
        isLiked: boolean;
        likeCount: number;
    };
    message?: string;
    timestamp: string;
}

/**
 * 태그 검색 응답 타입
 */
export interface TagSearchResponse {
    success: boolean;
    code: number;
    data: {
        tags: string[];
    };
    message?: string;
    timestamp: string;
}

/**
 * 백엔드 응답을 프론트엔드 FeedVideo 타입으로 변환
 */
function transformBackendVideo(backendVideo: BackendFeedVideo): FeedVideo {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const hlsUrl = `${baseUrl}/api/feed/videos/stream/${backendVideo.videoId}/master.m3u8`;

    return {
        _id: backendVideo.videoId,
        uploaderId: backendVideo.uploadedBy._id,
        uploaderName: backendVideo.uploadedBy.name || backendVideo.uploadedBy.businessName || 'Unknown',
        uploaderProfileImage: backendVideo.uploadedBy.profileImageFileName,
        title: backendVideo.title,
        description: '', // Backend doesn't provide this yet
        videoUrl: hlsUrl,
        thumbnailUrl: backendVideo.thumbnailUrl || '',
        hlsUrl: hlsUrl,
        duration: backendVideo.duration,
        viewCount: backendVideo.viewCount,
        likeCount: backendVideo.likeCount || 0,
        commentCount: 0, // Backend doesn't provide this yet
        tags: [], // Backend doesn't provide this yet
        createdAt: backendVideo.createdAt,
        updatedAt: backendVideo.createdAt,
        isLiked: false, // Backend doesn't provide this yet
    };
}

/**
 * Feed 비디오 목록 조회
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 10)
 * @param sortBy 정렬 기준 (latest, popular, trending)
 * @param tags 태그 필터 (쉼표로 구분)
 */
export const getFeedVideos = async (
    page: number = 1,
    limit: number = 10,
    sortBy: 'latest' | 'popular' | 'trending' = 'latest',
    tags?: string,
): Promise<FeedVideosResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
    });

    if (tags) {
        params.append('tags', tags);
    }

    // Backend response type
    interface BackendResponse {
        items: BackendFeedVideo[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }

    const response = await api.get<BackendResponse>(`/api/feed/videos?${params.toString()}`);

    // Transform backend response to frontend format
    return {
        success: true,
        code: 200,
        data: {
            items: response.data.items.map(transformBackendVideo),
            pagination: response.data.pagination,
        },
        timestamp: new Date().toISOString(),
    };
};

/**
 * 인기 비디오 목록 조회
 * @param limit 조회할 비디오 수 (기본값: 10)
 */
export const getPopularVideos = async (limit: number = 10): Promise<FeedVideosResponse> => {
    const response = await api.get<FeedVideosResponse>(`/api/feed/videos/popular?limit=${limit}`);
    return response.data;
};

/**
 * 비디오 좋아요/좋아요 취소
 * @param videoId 비디오 ID
 */
export const toggleVideoLike = async (videoId: string): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/api/feed/like/${videoId}`);
    return response.data;
};

/**
 * 백엔드 댓글을 프론트엔드 형식으로 변환
 */
function transformBackendComment(backendComment: BackendComment, videoId: string): FeedComment {
    return {
        _id: backendComment.commentId,
        commentId: backendComment.commentId,
        videoId: videoId,
        userId: backendComment.author._id,
        userName: backendComment.author.name || backendComment.author.businessName || 'Unknown',
        userProfileImage: backendComment.author.profileImageFileName,
        content: backendComment.content,
        likeCount: backendComment.likeCount,
        replyCount: backendComment.replyCount,
        isOwner: backendComment.isOwner,
        createdAt: backendComment.createdAt,
    };
}

/**
 * 비디오 댓글 목록 조회
 * @param videoId 비디오 ID
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 20)
 */
export const getVideoComments = async (
    videoId: string,
    page: number = 1,
    limit: number = 20,
): Promise<{ success: boolean; code: number; data: { items: FeedComment[]; totalCount: number; hasNextPage: boolean } }> => {
    const response = await api.get<FeedCommentsResponse>(
        `/api/feed/comment/${videoId}?page=${page}&limit=${limit}`,
    );

    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
        success: response.data.success,
        code: response.data.code,
        data: {
            items: response.data.data.comments.map(comment => transformBackendComment(comment, videoId)),
            totalCount: response.data.data.totalCount,
            hasNextPage: response.data.data.hasNextPage,
        },
    };
};

/**
 * 비디오 댓글 작성
 * @param videoId 비디오 ID
 * @param content 댓글 내용
 */
export const createVideoComment = async (
    videoId: string,
    content: string,
): Promise<{ success: boolean; data: FeedComment }> => {
    const response = await api.post(`/api/feed/comment/${videoId}`, { content });
    return response.data;
};

/**
 * 태그 검색
 * @param query 검색어
 */
export const searchTags = async (query: string): Promise<TagSearchResponse> => {
    const response = await api.get<TagSearchResponse>(`/api/feed/tag/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

/**
 * HLS 스트리밍 URL 생성
 * @param videoId 비디오 ID
 * @param filename HLS 파일명
 */
export const getHlsStreamUrl = (videoId: string, filename: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}/api/feed/videos/stream/${videoId}/${filename}`;
};
