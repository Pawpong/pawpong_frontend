import apiClient from './api';
import type { AnimalType } from '@/components/animal-tab-bar';
import type { Inquiry, InquiryListResponse, InquirySortType } from '@/app/(main)/inquiries/_types/inquiry';

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 상세 페이지용 목 데이터 1건 (API 실패/미연동 시 폴백) */
export const MOCK_INQUIRY_DETAIL: Inquiry = {
  id: 'inquiry-2',
  title: '리트리버 입양 전, 마당 펜스 높이는 어느 정도가 안전할까요?',
  content:
    '아이와 함께 자랄 대형견을 찾다가 리트리버 입양을 결정했습니다. 단독주택이라 마당에서 뛰어 놀게 하고 싶은데, 활동량이 워낙 많다고 들어서 담장 너머로 점프하거나 탈출하지 않을까 걱정됩니다. 안전한 펜스 높이와 바닥 재질 추천 부탁드려요!',
  type: 'common',
  animalType: 'dog',
  viewCount: 42,
  answerCount: 0,
  createdAt: '2025. 02. 15.',
  authorNickname: '입양자 닉네임',
  imageUrls: [],
};

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
    return { ...MOCK_INQUIRY_DETAIL, id: inquiryId };
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
