import apiClient from "./api";

/** 입양 신청 요청 데이터 */
export interface ApplicationCreateRequest {
  breederId: string;
  petId?: string;
  privacyConsent: boolean;
  selfIntroduction: string;
  familyMembers: string;
  allFamilyConsent: boolean;
  allergyTestInfo: string;
  timeAwayFromHome: string;
  livingSpaceDescription: string;
  previousPetExperience: string;
  canProvideBasicCare: boolean;
  canAffordMedicalExpenses: boolean;
  preferredPetDescription?: string;
  desiredAdoptionTiming?: string;
  additionalNotes?: string;
}

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

/** 입양 신청 목록 아이템 (백엔드 응답) */
export interface ApplicationListItemDto {
  applicationId: string;
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  profileImage?: string;
  animalType: "cat" | "dog";
  petId?: string;
  petBreed?: string;
  status: "consultation_pending" | "consultation_completed" | "adoption_approved" | "adoption_rejected";
  applicationDate: string; // "2024. 01. 15." 형식
}

/**
 * 입양 신청 제출
 * POST /api/adopter/application
 */
export const createApplication = async (
  requestData: ApplicationCreateRequest
): Promise<{ applicationId: string; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ applicationId: string; message: string }>>(
      "/api/adopter/application",
      requestData
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to create application");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Create application error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during application creation");
  }
};

/**
 * 내 입양 신청 목록 조회
 * GET /api/adopter/applications
 */
export const getMyApplications = async (
  page: number = 1,
  limit: number = 10,
  animalType?: "cat" | "dog"
): Promise<{
  applications: ApplicationListItemDto[];
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
      ApiResponse<PaginationResponse<ApplicationListItemDto>>
    >("/api/adopter/applications", {
      params: { page, limit, animalType },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch applications");
    }

    const { items, pagination } = response.data.data;

    return { applications: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fetch applications error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during applications fetch");
  }
};

/** 입양 신청 상세 응답 (백엔드 응답) */
export interface ApplicationDetailDto {
  applicationId: string;
  breederId: string;
  breederName: string;
  petId?: string;
  petName?: string;
  status: string;
  standardResponses: {
    privacyConsent: boolean;
    selfIntroduction: string;
    familyMembers: string;
    allFamilyConsent: boolean;
    allergyTestInfo: string;
    timeAwayFromHome: string;
    livingSpaceDescription: string;
    previousPetExperience: string;
    canProvideBasicCare: boolean;
    canAffordMedicalExpenses: boolean;
    preferredPetDescription?: string;
    desiredAdoptionTiming?: string;
    additionalNotes?: string;
  };
  customResponses: Array<{
    questionId: string;
    questionLabel: string;
    questionType: string;
    answer: string;
  }>;
  appliedAt: string;
  processedAt?: string;
  breederNotes?: string;
}

/**
 * 입양 신청 상세 조회
 * GET /api/adopter/applications/:id
 */
export const getApplicationDetail = async (
  applicationId: string
): Promise<ApplicationDetailDto> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationDetailDto>>(
      `/api/adopter/applications/${applicationId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch application detail");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fetch application detail error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during application detail fetch");
  }
};
