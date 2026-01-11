import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyReviews, type MyReviewItemDto } from '@/lib/review';
import { formatDateToDotNotation } from '@/utils/date-utils';

export interface MyReviewItem {
  reviewId: string;
  applicationId: string | null;
  breederId: string;
  breederName: string;
  breederLevel: 'elite' | 'new';
  applicationDate: string;
  profileImage: string;
  animalType: 'cat' | 'dog';
  reviewType: '상담 후기' | '입양 후기';
  reviewContent: string;
  reviewDate: string;
}

interface MyReviewsResponse {
  data: MyReviewItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * 백엔드 DTO를 프론트엔드 MyReviewItem으로 변환
 */
const mapDtoToMyReviewItem = (dto: MyReviewItemDto): MyReviewItem => {
  // reviewType 매핑: consultation -> 상담 후기, adoption -> 입양 후기
  const reviewTypeMap: Record<string, '상담 후기' | '입양 후기'> = {
    consultation: '상담 후기',
    adoption_completed: '입양 후기',
    adoption: '입양 후기',
  };

  return {
    reviewId: dto.reviewId,
    applicationId: dto.applicationId,
    breederId: dto.breederId || '',
    breederName: dto.breederNickname,
    breederLevel: dto.breederLevel === 'gold' || dto.breederLevel === 'platinum' ? 'elite' : 'new',
    applicationDate: formatDateToDotNotation(dto.writtenAt), // 작성일을 신청일로 사용
    profileImage: dto.breederProfileImage || '/profile-empty.svg',
    animalType: dto.breedingPetType as 'cat' | 'dog',
    reviewType: reviewTypeMap[dto.reviewType] || '상담 후기',
    reviewContent: dto.content,
    reviewDate: formatDateToDotNotation(dto.writtenAt),
  };
};

const fetchMyReviews = async (page: number): Promise<MyReviewsResponse> => {
  const result = await getMyReviews(page, PAGE_SIZE);

  return {
    data: result.reviews.map(mapDtoToMyReviewItem),
    hasMore: result.pagination.hasNextPage,
  };
};

export function useMyReviews() {
  return useInfiniteQuery({
    queryKey: ['my-reviews'],
    queryFn: ({ pageParam }) => fetchMyReviews(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
