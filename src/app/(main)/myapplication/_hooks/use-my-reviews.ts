import { useInfiniteQuery } from "@tanstack/react-query";
import { myReviewMockData } from "../_mocks/my-review-mock-data";

export interface MyReviewItem {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
  reviewType: "상담 후기" | "입양 후기";
  reviewContent: string;
  reviewDate: string;
}

interface MyReviewsResponse {
  data: MyReviewItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const fetchMyReviews = async (page: number): Promise<MyReviewsResponse> => {
  // TODO: API 연동 시 아래 주석 해제
  // const response = await api.get(`/my-reviews`, {
  //   params: { page, limit: PAGE_SIZE },
  // });
  // return response.data;

  // 목 데이터
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return {
    data: myReviewMockData.slice(startIndex, endIndex),
    hasMore: endIndex < myReviewMockData.length,
  };
};

export function useMyReviews() {
  return useInfiniteQuery({
    queryKey: ["my-reviews"],
    queryFn: ({ pageParam }) => fetchMyReviews(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
}
