import apiClient from './api';

/**
 * 공지사항 타입 정의
 */
export interface Notice {
  noticeId: string;
  title: string;
  content: string;
  authorName: string;
  status: 'published' | 'draft' | 'archived';
  isPinned: boolean;
  viewCount: number;
  publishedAt?: string;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 페이지네이션 응답 타입
 */
export interface NoticePaginationResponse {
  success: boolean;
  code: number;
  data: {
    items: Notice[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
  timestamp: string;
}

/**
 * 공지사항 상세 응답 타입
 */
export interface NoticeDetailResponse {
  success: boolean;
  code: number;
  data: Notice;
  message: string;
  timestamp: string;
}

/**
 * 공지사항 목록 조회
 */
export async function getNoticeList(page: number = 1, pageSize: number = 10): Promise<NoticePaginationResponse> {
  try {
    const response = await apiClient.get<NoticePaginationResponse>('/api/notice', {
      params: { page, pageSize },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || '공지사항 목록 조회에 실패했습니다.');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Notice list fetch error:', error.message);
      throw error;
    }
    throw new Error('공지사항 목록 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 공지사항 상세 조회
 */
export async function getNoticeDetail(noticeId: string): Promise<NoticeDetailResponse> {
  try {
    const response = await apiClient.get<NoticeDetailResponse>(`/api/notice/${noticeId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || '공지사항 상세 조회에 실패했습니다.');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Notice detail fetch error:', error.message);
      throw error;
    }
    throw new Error('공지사항 상세 조회 중 오류가 발생했습니다.');
  }
}
