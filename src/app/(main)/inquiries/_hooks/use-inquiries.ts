import { useInfiniteQuery } from '@tanstack/react-query';
import type { AnimalType } from '@/components/animal-tab-bar';
import type { Inquiry, InquiryListResponse, InquirySortType } from '../_types/inquiry';

const PAGE_SIZE = 15;

const MOCK_INQUIRIES: Inquiry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `inquiry-${i + 1}`,
  title: '리트리버 입양 전, 마당 펜스 높이는 어느 정도가 안전할까요?',
  content:
    '아이와 함께 자랄 대형견을 찾다가 리트리버 입양을 결정했습니다. 단독주택이라 마당에서 뛰어놀게 하고 싶은데, 활동량이 워낙 많다고 들어서 담장 너머로 점프하거나 탈출하지 않을까 걱정됩니다. 안전한 펜스 높이와 바닥 재질 추천 부탁드려요!',
  type: i % 5 === 3 ? 'direct' : 'common',
  animalType: i % 3 === 0 ? 'cat' : 'dog',
  viewCount: Math.floor(Math.random() * 200) + 10,
  answerCount: i % 4 === 0 ? 0 : Math.floor(Math.random() * 5) + 1,
  latestAnswer:
    i % 4 === 0
      ? undefined
      : {
          breederName: '골든레인 리트리버',
          answeredAt: '2025. 06. 15. 답변 작성',
          content:
            '리트리버는 점프력도 좋지만, 호기심이 많아 담장 너머를 보려다 사고가 나기 쉽습니다. 펜스 높이는 최소 1.5m에서 1.8m를 권장하며, 아래쪽 틈새가 없어야 합니다. 바닥은 배수가 잘되는 인조잔디나 천연잔디가 관절에 가장 좋으며, 배변 활동이 잦은 곳은 고압 세척이 쉬운 판석을 까는 것이 위생적입니다.',
        },
  createdAt: '2025-06-10',
}));

/**
 * TODO: 실제 API 연결 시 아래 fetchInquiries를 API 호출로 교체
 */
const fetchInquiries = async (
  page: number,
  animal: AnimalType,
  _sort: InquirySortType,
): Promise<InquiryListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const filtered = MOCK_INQUIRIES.filter((item) => item.animalType === animal);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    data: filtered.slice(start, end),
    hasMore: end < filtered.length,
  };
};

export function useInquiries(animal: AnimalType, sort: InquirySortType) {
  return useInfiniteQuery({
    queryKey: ['inquiries', animal, sort],
    queryFn: ({ pageParam }) => fetchInquiries(pageParam, animal, sort),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
