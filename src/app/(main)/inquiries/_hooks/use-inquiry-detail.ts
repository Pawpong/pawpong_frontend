import { useQuery } from '@tanstack/react-query';
import type { Inquiry } from '../_types/inquiry';

/**
 * TODO: 실제 API 연결 시 fetchInquiryDetail를 API 호출로 교체
 */
const fetchInquiryDetail = async (id: string): Promise<Inquiry | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const isValidInquiryId = /^inquiry-\d+$/.test(id);

  if (!isValidInquiryId) {
    return null;
  }

  const mock: Inquiry = {
    id,
    title: '리트리버 입양 전, 마당 펜스 높이는 어느 정도가 안전할까요?',
    content:
      '아이와 함께 자랄 대형견을 찾다가 리트리버 입양을 결정했습니다. 단독주택이라 마당에서 뛰어 놀게 하고 싶은데, 활동량이 워낙 많다고 들어서 담장 너머로 점프하거나 탈출하지 않을까 걱정됩니다. 안전한 펜스 높이와 바닥 재질 추천 부탁드려요!',
    type: 'common',
    animalType: 'dog',
    viewCount: 42,
    answerCount: 0,
    createdAt: '2025. 02. 15.',
    authorNickname: '입양자 닉네임',
    imageUrls: ['', '', '', ''], // 2x2 placeholder
  };

  return mock;
};

export function useInquiryDetail(id: string | null) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => fetchInquiryDetail(id!),
    enabled: !!id,
  });
}
