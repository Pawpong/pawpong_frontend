import apiClient from "./api";

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 브리더 프로필 업데이트 요청 */
export interface ProfileUpdateRequest {
  profileDescription?: string;
  locationInfo?: {
    cityName: string;
    districtName: string;
    detailAddress?: string;
  };
  profilePhotos?: string[];
  priceRangeInfo?: {
    minimumPrice: number;
    maximumPrice: number;
  };
  specializationTypes?: string[];
  experienceYears?: number;
}

/** 부모 반려동물 추가 요청 */
export interface ParentPetAddRequest {
  name: string;
  breed: string;
  gender: "male" | "female";
  birthDate: string; // YYYY-MM-DD 형식
  photoFileName: string;
  description?: string;
}

/** 분양 가능 반려동물 추가 요청 */
export interface AvailablePetAddRequest {
  name: string;
  breed: string;
  gender: "male" | "female";
  birthDate: string; // YYYY-MM-DD 형식
  price: number;
  description?: string;
  parentInfo?: {
    mother?: string;
    father?: string;
  };
}

/**
 * 브리더 프로필 조회
 * GET /api/breeder-management/profile
 */
export const getBreederProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      "/api/breeder-management/profile"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeder profile");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder profile fetch error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder profile fetch");
  }
};

/**
 * 브리더 프로필 수정
 * PATCH /api/breeder-management/profile
 */
export const updateBreederProfile = async (
  data: ProfileUpdateRequest
): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      "/api/breeder-management/profile",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to update breeder profile");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder profile update error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder profile update");
  }
};

/**
 * 부모 반려동물 추가
 * POST /api/breeder-management/parent-pets
 */
export const addParentPet = async (
  data: ParentPetAddRequest
): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/breeder-management/parent-pets",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to add parent pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Add parent pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during add parent pet");
  }
};

/**
 * 부모 반려동물 수정
 * PATCH /api/breeder-management/parent-pets/:petId
 */
export const updateParentPet = async (
  petId: string,
  data: Partial<ParentPetAddRequest>
): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/breeder-management/parent-pets/${petId}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to update parent pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Update parent pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during update parent pet");
  }
};

/**
 * 부모 반려동물 삭제
 * DELETE /api/breeder-management/parent-pets/:petId
 */
export const deleteParentPet = async (petId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/breeder-management/parent-pets/${petId}`
    );

    if (!response.data.success) {
      throw new Error("Failed to delete parent pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Delete parent pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during delete parent pet");
  }
};

/**
 * 분양 가능 반려동물 추가
 * POST /api/breeder-management/available-pets
 */
export const addAvailablePet = async (
  data: AvailablePetAddRequest
): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/breeder-management/available-pets",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to add available pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Add available pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during add available pet");
  }
};

/**
 * 분양 가능 반려동물 수정
 * PATCH /api/breeder-management/available-pets/:petId
 */
export const updateAvailablePet = async (
  petId: string,
  data: Partial<AvailablePetAddRequest>
): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/breeder-management/available-pets/${petId}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to update available pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Update available pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during update available pet");
  }
};

/**
 * 분양 가능 반려동물 삭제
 * DELETE /api/breeder-management/available-pets/:petId
 */
export const deleteAvailablePet = async (petId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/breeder-management/available-pets/${petId}`
    );

    if (!response.data.success) {
      throw new Error("Failed to delete available pet");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Delete available pet error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during delete available pet");
  }
};
