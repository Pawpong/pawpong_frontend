import apiClient from "./api";

// ============================================
// 공통 타입
// ============================================

/** 공통 API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/** 소셜 로그인 제공자 */
export type SocialProvider = "google" | "naver" | "kakao";

/** 사용자 역할 */
export type UserRole = "adopter" | "breeder" | "admin";

/** 계정 상태 */
export type AccountStatus = "active" | "suspended" | "deleted";

/** 브리더 레벨 */
export type BreederLevel = "new" | "elite";

/** 서류 타입 */
export type DocumentType =
  | "idCard" // 신분증 사본
  | "animalProductionLicense" // 동물생산업 등록증
  | "adoptionContractSample" // 표준 입양계약서 샘플
  | "recentAssociationDocument" // 최근 발급한 협회 서류
  | "breederCertification" // 고양이 브리더 인증 서류
  | "ticaCfaDocument"; // TICA 또는 CFA 서류 (선택)

// ============================================
// 입양자 회원가입 관련
// ============================================

/** 입양자 회원가입 요청 DTO */
export interface AdopterRegistrationDto {
  /** 소셜 로그인 임시 ID */
  tempId: string;
  /** 닉네임 */
  nickname: string;
  /** 전화번호 (010-1234-5678) */
  phoneNumber: string;
  /** 프로필 이미지 CDN URL (선택) */
  profileImage?: string;
}

/** 입양자 회원가입 응답 DTO */
export interface AdopterRegistrationResponseDto {
  adopterId: string;
  email: string;
  nickname: string;
  phoneNumber: string;
  profileImage: string;
  userRole: "adopter";
  accountStatus: AccountStatus;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// 브리더 회원가입 관련
// ============================================

/** 브리더 회원가입 요청 DTO */
export interface RegisterBreederDto {
  // 기본 정보
  email: string;
  password?: string; // 일반 가입 시 필수
  phoneNumber: string;
  profileImage?: string; // CDN URL

  // 소셜 로그인 정보 (소셜 가입 시)
  tempId?: string;
  provider?: SocialProvider;

  // 브리더 정보
  breederName: string;
  breederLocation: {
    city: string;
    district: string;
  };
  breeds: string[];
  animal: "cat" | "dog";

  // 플랜 정보
  plan: "basic" | "pro";

  // 인증 정보 (선택)
  level?: BreederLevel;
  documentUrls?: string[];
  documentTypes?: DocumentType[];

  // 약관 동의
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    marketingConsent?: boolean;
  };
}

/** 브리더 회원가입 응답 DTO */
export interface RegisterBreederResponseDto {
  breederId: string;
  email: string;
  breederName: string;
  phoneNumber: string;
  profileImage?: string;
  userRole: "breeder";
  accountStatus: AccountStatus;
  plan: "basic" | "pro";
  verificationStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// 파일 업로드 관련
// ============================================

/** 프로필 이미지 업로드 응답 DTO */
export interface UploadProfileResponseDto {
  cdnUrl: string;
  fileName: string;
  size: number;
}

/** 업로드된 인증 서류 정보 */
export interface UploadedVerificationDocument {
  type: DocumentType;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

/** 인증 서류 업로드 응답 DTO */
export interface VerificationDocumentsResponseDto {
  uploadedDocuments: UploadedVerificationDocument[];
  allDocuments: UploadedVerificationDocument[];
}

// ============================================
// API 함수들
// ============================================

/** 이메일 중복 확인 */
export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ isDuplicate: boolean }>
    >("/api/auth/check-email", { email });
    return response.data.data?.isDuplicate ?? false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Email duplication check error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during email check.");
  }
};

/** 닉네임 중복 확인 */
export const checkNicknameDuplicate = async (
  nickname: string
): Promise<boolean> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ isDuplicate: boolean }>
    >("/api/auth/check-nickname", { nickname });
    return response.data.data?.isDuplicate ?? false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Nickname duplication check error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during nickname check.");
  }
};

/** SMS 발송 */
export const sendVerificationCode = async (phone: string): Promise<void> => {
  try {
    const cleanPhone = phone.replace(/-/g, "");
    const response = await apiClient.post<ApiResponse<null>>(
      "/api/auth/phone/send-code",
      { phone: cleanPhone }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message ?? "Failed to send verification code."
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SMS send error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while sending verification code.");
  }
};

/** SMS 인증 */
export const verifyCode = async (
  phone: string,
  code: string
): Promise<void> => {
  try {
    const cleanPhone = phone.replace(/-/g, "");
    const response = await apiClient.post<ApiResponse<null>>(
      "/api/auth/phone/verify-code",
      { phone: cleanPhone, code }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message ?? "Verification code does not match."
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SMS verification error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during verification.");
  }
};

/** 프로필 이미지 업로드 API */
export const uploadProfileImage = async (file: File, tempId?: string): Promise<string> => {
  try {
    // FormData 생성
    const formData = new FormData();
    formData.append("file", file);

    // tempId가 있으면 쿼리 파라미터로 추가
    const url = tempId
      ? `/api/auth/upload-breeder-profile?tempId=${encodeURIComponent(tempId)}`
      : "/api/auth/upload-breeder-profile";

    // multipart/form-data 요청
    const response = await apiClient.post<
      ApiResponse<UploadProfileResponseDto>
    >(url, formData);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message ?? "Profile image upload failed."
      );
    }

    // ⚠️ 중요: fileName 반환 (DB 저장용)
    // cdnUrl은 미리보기용이고, 실제 DB에는 fileName을 저장해야 함
    return response.data.data.fileName;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile image upload error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during profile image upload.");
  }
};

/** 브리더 인증 서류 업로드 API */
export const uploadVerificationDocuments = async (
  files: File[],
  types: DocumentType[],
  level: BreederLevel,
  tempId?: string
): Promise<VerificationDocumentsResponseDto> => {
  try {
    // FormData 생성
    const formData = new FormData();

    // 파일들 추가
    files.forEach((file) => {
      formData.append("files", file);
    });

    // types 배열을 JSON 문자열로 변환하여 추가
    formData.append("types", JSON.stringify(types));

    // level 추가
    formData.append("level", level);

    // tempId가 있으면 쿼리 파라미터로 추가
    const url = tempId
      ? `/api/auth/upload-breeder-documents?tempId=${encodeURIComponent(tempId)}`
      : "/api/auth/upload-breeder-documents";

    // multipart/form-data 요청
    const response = await apiClient.post<
      ApiResponse<VerificationDocumentsResponseDto>
    >(url, formData);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message ?? "Document upload failed.");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Document upload error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during document upload.");
  }
};

/** 입양자 회원가입 완료 */
export const completeAdopterRegistration = async (
  data: AdopterRegistrationDto
): Promise<AdopterRegistrationResponseDto> => {
  try {
    const response = await apiClient.post<
      ApiResponse<AdopterRegistrationResponseDto>
    >("/api/auth/register/adopter", data);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error ?? response.data.message ?? "Registration failed."
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Adopter registration error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during registration.");
  }
};

/** 브리더 회원가입 완료 */
export const registerBreeder = async (
  data: RegisterBreederDto
): Promise<RegisterBreederResponseDto> => {
  try {
    const response = await apiClient.post<
      ApiResponse<RegisterBreederResponseDto>
    >("/api/auth/register/breeder", data);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error ?? response.data.message ?? "Breeder registration failed."
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder registration error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder registration.");
  }
};

// ============================================
// 브리더 프로필 조회 관련
// ============================================

/** 브리더 프로필 조회 응답 DTO */
export interface BreederProfileDto {
  breederId: string;
  email: string;
  name: string;
  phoneNumber: string;
  profileImageUrl?: string;
  petType: string;
  breeds: string[];
  verificationStatus: string;
  verificationLevel: string;
  verificationPlan: string;
  verificationDocuments: Array<{
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  profile: {
    description: string;
    location: {
      city: string;
      district: string;
    };
    representativePhotos: string[];
    specialization: string[];
  };
  stats: {
    totalApplications: number;
    totalFavorites: number;
    completedAdoptions: number;
    averageRating: number;
    totalReviews: number;
    profileViews: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

/** 브리더 프로필 조회 API */
export const getBreederProfile = async (): Promise<BreederProfileDto> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederProfileDto>>(
      "/api/breeder-management/profile"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message ?? "Failed to fetch breeder profile."
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder profile fetch error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during profile fetch.");
  }
};
