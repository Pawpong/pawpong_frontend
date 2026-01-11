import apiClient from './api';

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 페이지네이션 응답 */
interface PaginationResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/** 공지사항 응답 DTO */
export interface AnnouncementDto {
  announcementId: string;
  title: string;
  content: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 공지사항 목록 조회
 * GET /api/announcement/list
 */
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10,
): Promise<{
  announcements: AnnouncementDto[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginationResponse<AnnouncementDto>>>('/api/announcement/list', {
      params: { page, limit },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch announcements');
    }

    const { items, pagination } = response.data.data;

    return { announcements: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch announcements error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during announcements fetch');
  }
};

/**
 * 공지사항 상세 조회
 * GET /api/announcement/:announcementId
 */
export const getAnnouncementDetail = async (announcementId: string): Promise<AnnouncementDto> => {
  try {
    const response = await apiClient.get<ApiResponse<AnnouncementDto>>(`/api/announcement/${announcementId}`);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch announcement detail');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch announcement detail error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during announcement detail fetch');
  }
};
