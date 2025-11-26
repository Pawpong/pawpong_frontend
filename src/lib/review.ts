import apiClient from "./api";

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 백엔드 페이지네이션 응답 */
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

/** 내 후기 아이템 DTO (백엔드 응답) */
export interface MyReviewItemDto {
  reviewId: string;
  applicationId: string | null;
  breederId: string | null;
  breederNickname: string;
  breederProfileImage: string | null;
  breederLevel: string;
  breedingPetType: string;
  content: string;
  reviewType: string;
  writtenAt: Date;
}

/** 후기 작성 요청 */
export interface ReviewCreateRequest {
  applicationId: string;
  reviewType: "consultation" | "adoption";
  content: string;
}

/**
 * 내가 작성한 후기 목록 조회
 * GET /api/adopter/reviews
 */
export const getMyReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  reviews: MyReviewItemDto[];
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
    const response = await apiClient.get<
      ApiResponse<PaginationResponse<MyReviewItemDto>>
    >("/api/adopter/reviews", {
      params: { page, limit },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch reviews");
    }

    const { items, pagination } = response.data.data;

    return { reviews: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fetch reviews error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during reviews fetch");
  }
};

/**
 * 후기 작성
 * POST /api/adopter/review
 */
export const createReview = async (
  requestData: ReviewCreateRequest
): Promise<{ reviewId: string; message: string }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ reviewId: string; message: string }>
    >("/api/adopter/review", requestData);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to create review"
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Create review error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during review creation");
  }
};
