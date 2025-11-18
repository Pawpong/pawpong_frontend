import apiClient from "./api";

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 품종 카테고리 */
export interface BreedCategory {
  category: string;
  categoryDescription?: string;
  breeds: string[];
}

/** 품종 목록 응답 */
export interface GetBreedsResponse {
  petType: string;
  categories: BreedCategory[];
}

/**
 * 품종 목록 조회
 * GET /api/breeds/:petType
 * @param petType - "dog" 또는 "cat"
 */
export const getBreeds = async (
  petType: "dog" | "cat"
): Promise<GetBreedsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<GetBreedsResponse>>(
      `/api/breeds/${petType}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeds");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeds fetch error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeds fetch");
  }
};
