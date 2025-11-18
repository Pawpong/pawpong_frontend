import apiClient from "./api";

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 브리더 레벨 옵션 */
export interface BreederLevelOption {
  value: string;
  label: string;
  description: string;
}

/** 정렬 옵션 */
export interface SortOption {
  value: string;
  label: string;
  description: string;
}

/** 강아지 크기 옵션 */
export interface DogSizeOption {
  value: string;
  label: string;
  description: string;
}

/** 고양이 털 길이 옵션 */
export interface CatFurLengthOption {
  value: string;
  label: string;
  description: string;
}

/** 입양 가능 여부 옵션 */
export interface AdoptionStatusOption {
  value: boolean;
  label: string;
  description: string;
}

/** 전체 필터 옵션 응답 */
export interface AllFilterOptions {
  breederLevels: BreederLevelOption[];
  sortOptions: SortOption[];
  dogSizes: DogSizeOption[];
  catFurLengths: CatFurLengthOption[];
  adoptionStatus: AdoptionStatusOption[];
}

/**
 * 전체 필터 옵션 조회 (한번에 모든 옵션 가져오기)
 * GET /api/filter-options
 */
export const getAllFilterOptions = async (): Promise<AllFilterOptions> => {
  try {
    const response = await apiClient.get<ApiResponse<AllFilterOptions>>(
      "/api/filter-options"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch filter options");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Filter options error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during filter options fetch");
  }
};

/**
 * 브리더 레벨 옵션 조회
 * GET /api/filter-options/breeder-levels
 */
export const getBreederLevels = async (): Promise<BreederLevelOption[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederLevelOption[]>>(
      "/api/filter-options/breeder-levels"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeder levels");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder levels error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder levels fetch");
  }
};

/**
 * 정렬 옵션 조회
 * GET /api/filter-options/sort-options
 */
export const getSortOptions = async (): Promise<SortOption[]> => {
  try {
    const response = await apiClient.get<ApiResponse<SortOption[]>>(
      "/api/filter-options/sort-options"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch sort options");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Sort options error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during sort options fetch");
  }
};

/**
 * 강아지 크기 옵션 조회
 * GET /api/filter-options/dog-sizes
 */
export const getDogSizes = async (): Promise<DogSizeOption[]> => {
  try {
    const response = await apiClient.get<ApiResponse<DogSizeOption[]>>(
      "/api/filter-options/dog-sizes"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch dog sizes");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Dog sizes error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during dog sizes fetch");
  }
};

/**
 * 고양이 털 길이 옵션 조회
 * GET /api/filter-options/cat-fur-lengths
 */
export const getCatFurLengths = async (): Promise<CatFurLengthOption[]> => {
  try {
    const response = await apiClient.get<ApiResponse<CatFurLengthOption[]>>(
      "/api/filter-options/cat-fur-lengths"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch cat fur lengths");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Cat fur lengths error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during cat fur lengths fetch");
  }
};

/**
 * 입양 가능 여부 옵션 조회
 * GET /api/filter-options/adoption-status
 */
export const getAdoptionStatus = async (): Promise<AdoptionStatusOption[]> => {
  try {
    const response = await apiClient.get<ApiResponse<AdoptionStatusOption[]>>(
      "/api/filter-options/adoption-status"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch adoption status");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Adoption status error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during adoption status fetch");
  }
};
