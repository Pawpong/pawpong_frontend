import apiClient from "./api";

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 입양자 프로필 응답 DTO (백엔드 응답) */
export interface AdopterProfileDto {
  adopterId: string;
  email: string;
  name: string;
  nickname: string;
  phone?: string;
  profileImage?: string;
  marketingAgreed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 입양자 프로필 수정 요청 DTO */
export interface AdopterProfileUpdateRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
}

/** 입양자 프로필 수정 응답 DTO (백엔드 응답) */
export interface AdopterProfileUpdateDto {
  adopterId: string;
  updatedFields: string[];
  message: string;
}

/**
 * 입양자 프로필 조회
 * GET /api/adopter/profile
 */
export const getAdopterProfile = async (): Promise<AdopterProfileDto> => {
  try {
    const response = await apiClient.get<ApiResponse<AdopterProfileDto>>(
      "/api/adopter/profile"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch adopter profile");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fetch adopter profile error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during adopter profile fetch");
  }
};

/**
 * 입양자 프로필 수정
 * PATCH /api/adopter/profile
 */
export const updateAdopterProfile = async (
  updateData: AdopterProfileUpdateRequest
): Promise<AdopterProfileUpdateDto> => {
  try {
    const response = await apiClient.patch<
      ApiResponse<AdopterProfileUpdateDto>
    >("/api/adopter/profile", updateData);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to update adopter profile"
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Update adopter profile error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during adopter profile update");
  }
};

/** 회원 탈퇴 사유 */
export enum WithdrawReason {
  SERVICE_DISSATISFACTION = "service_dissatisfaction",
  PRIVACY_CONCERN = "privacy_concern",
  LOW_USAGE = "low_usage",
  ADOPTION_COMPLETED = "adoption_completed",
  OTHER = "other",
}

/** 회원 탈퇴 요청 DTO */
export interface AccountDeleteRequest {
  reason: WithdrawReason;
  otherReason?: string;
}

/** 회원 탈퇴 응답 DTO */
export interface AccountDeleteResponse {
  adopterId: string;
  deletedAt: string;
  message: string;
}

/**
 * 입양자 회원 탈퇴
 * DELETE /api/adopter/account
 */
export const deleteAccount = async (
  deleteData: AccountDeleteRequest
): Promise<AccountDeleteResponse> => {
  try {
    const response = await apiClient.delete<
      ApiResponse<AccountDeleteResponse>
    >("/api/adopter/account", { data: deleteData });

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to delete account"
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Delete account error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during account deletion");
  }
};
