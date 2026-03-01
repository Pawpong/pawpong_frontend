import apiClient from './api';
import type { AnimalType } from '@/components/animal-tab-bar';
import type { Inquiry, InquiryListResponse, InquirySortType } from '@/app/(main)/inquiries/_types/inquiry';

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 문의 목록 조회
 * GET /api/inquiry
 */
export const getInquiries = async (
  page: number,
  animalType: AnimalType,
  sort: InquirySortType,
): Promise<InquiryListResponse> => {
  const response = await apiClient.get<ApiResponse<InquiryListResponse>>('/api/inquiry', {
    params: { page, limit: 15, animalType, sort },
  });

  return response.data.data || { data: [], hasMore: false };
};

/**
 * 문의 상세 조회
 * GET /api/inquiry/:inquiryId
 */
export const getInquiryDetail = async (inquiryId: string): Promise<Inquiry | null> => {
  try {
    const response = await apiClient.get<ApiResponse<Inquiry>>(`/api/inquiry/${inquiryId}`);
    return response.data.data || null;
  } catch {
    return null;
  }
};

/**
 * 문의 작성
 * POST /api/inquiry
 */
export const createInquiry = async (data: {
  title: string;
  content: string;
  type: 'common' | 'direct';
  animalType: AnimalType;
  targetBreederId?: string;
  imageUrls?: string[];
}): Promise<{ inquiryId: string }> => {
  const response = await apiClient.post<ApiResponse<{ inquiryId: string }>>('/api/inquiry', data);
  if (!response.data.success || !response.data.data) {
    throw new Error('문의 작성에 실패했습니다.');
  }
  return response.data.data;
};

/**
 * 답변 작성
 * POST /api/inquiry/:inquiryId/answer
 */
export const createInquiryAnswer = async (inquiryId: string, content: string): Promise<void> => {
  const response = await apiClient.post<ApiResponse<null>>(`/api/inquiry/${inquiryId}/answer`, { content });
  if (!response.data.success) {
    throw new Error('답변 작성에 실패했습니다.');
  }
};
