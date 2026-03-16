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
  answerCount: 3,
  createdAt: '2025. 02. 15.',
  authorNickname: '입양자 닉네임',
  imageUrls: ['/dog-and-cat.svg', '/profile-empty.svg', '/dog-and-cat.svg'],
  answers: [
    {
      id: 'answer-1',
      breederName: '해피브리더',
      answeredAt: '2025. 02. 16.',
      content:
        '리트리버는 점프력도 좋지만, 호기심이 많아 담장 너머를 보려다 사고가 나기 쉽습니다. 펜스 높이는 최소 1.5m에서 1.8m를 권장하며, 아래쪽 틈새가 없어야 합니다. 바닥은 배수가 잘되는 인조잔디나 천연잔디가 관절에 가장 좋으며, 배변 활동이 잦은 곳은 고압 세척이 쉬운 판석을 까는 것이 위생적입니다. 입양 전 마당 환경을 사진으로 보내주시면 더 자세히 봐드릴게요.',
      animalTypeName: '강아지',
      breed: '골든 리트리버',
      helpfulCount: 12,
      imageUrls: ['/dog-and-cat.svg'],
    },
    {
      id: 'answer-2',
      breederName: '사랑이브리더',
      answeredAt: '2025. 02. 17.',
      content:
        '저희도 리트리버 키우고 있어요. 펜스는 1.8m로 하시고, 땅에 30cm 정도 박아두시면 탈출 방지에 좋아요. 바닥은 잔디보다는 배수가 되는 자재를 추천드립니다.',
      animalTypeName: '강아지',
      breed: '래브라도 리트리버',
      helpfulCount: 5,
    },
    {
      id: 'answer-3',
      breederName: '냥이브리더',
      answeredAt: '2025. 02. 18.',
      content:
        '고양이 브리더로서 답변드립니다. 리트리버와 함께 사는 가정에서는 고양이 전용 공간을 마련해 주시는 것이 좋아요. 대형견과의 첫 대면 시에는 격리된 방에서 서서히 적응시키는 것을 추천드립니다.',
      animalTypeName: '고양이',
      breed: '러시안 블루',
      helpfulCount: 3,
    },
  ],
  currentUserHasAnswered: false,
};

/**
 * 답변 도움됐어요 등록/취소
 * TODO: API 연동 후 구현
 * 예상: POST /api/inquiry/:inquiryId/answer/:answerId/helpful (토글)
 */
export const submitInquiryAnswerHelpful = async (_inquiryId: string, _answerId: string): Promise<void> => {
  // TODO: API 연동 후 아래 주석 해제 및 호출
  // const response = await apiClient.post<ApiResponse<null>>(
  //   `/api/inquiry/${_inquiryId}/answer/${_answerId}/helpful`,
  // );
  // if (!response.data.success) throw new Error('도움됐어요 처리에 실패했습니다.');
  void _inquiryId;
  void _answerId;
  await Promise.resolve();
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
 * 브리더 내 답변 목록 조회
 * GET /api/inquiry/breeder?answered=true|false&page=1&limit=15
 */
export const getBreederInquiries = async (answered: boolean, page: number): Promise<InquiryListResponse> => {
  const response = await apiClient.get<ApiResponse<InquiryListResponse>>('/api/inquiry/breeder', {
    params: { answered, page, limit: 15 },
  });
  return response.data.data || { data: [], hasMore: false };
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
