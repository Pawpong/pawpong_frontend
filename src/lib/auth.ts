import apiClient from "./api";

/** Adopter DTO */
export interface AdopterRegistrationDto {
  tempId: string;
  email: string;
  name: string;
  nickname: string;
  phone?: string;
  marketingAgreed?: boolean;
}

/** Breeder DTO */
export interface BreederRegistrationDto {
  tempId: string;
  email: string;
  name: string;
  phone: string;
  petType: string;
  plan: string;
  breederName: string;
  introduction?: string;
  city: string;
  district: string;
  breeds: string[];
  level: string;
  marketingAgreed: boolean;
}

/** 새로운 브리더 회원가입 DTO (신규 엔드포인트용) */
export interface RegisterBreederDto {
  email: string;
  phoneNumber: string;
  breederName: string;
  breederLocation: string;
  animal: string;
  breeds: string[];
  plan: string;
  level: string;
  termAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
  tempId?: string;
  provider?: string;
  profileImage?: string;
  documentUrls?: string[]; // 업로드된 서류 URL 배열
  documentTypes?: string[]; // 업로드된 서류 타입 배열
}

/** 브리더 회원가입 응답 DTO */
export interface RegisterBreederResponseDto {
  breederId: string;
  email: string;
  breederName: string;
  breederLocation: string;
  animal: string;
  breeds: string[];
  plan: string;
  level: string;
  verificationStatus: string;
  createdAt: string;
  accessToken: string;
}

/** Auth Response DTO */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  userInfo: unknown;
}

/** 공통 API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

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

/** 입양자 회원가입 완료 */
export const completeAdopterRegistration = async (
  data: AdopterRegistrationDto
): Promise<AuthResponseDto> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
      "/api/auth/social/complete",
      {
        tempId: data.tempId,
        email: data.email,
        name: data.name,
        role: "adopter",
        nickname: data.nickname,
        phone: data.phone,
        marketingAgreed: data.marketingAgreed ?? false,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Registration failed.");
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

/** 브리더 회원가입 완료 (기존 - 소셜 로그인용) */
export const completeBreederRegistration = async (
  data: BreederRegistrationDto
): Promise<AuthResponseDto> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
      "/api/auth/social/complete",
      {
        tempId: data.tempId,
        email: data.email,
        name: data.name,
        role: "breeder",
        phone: data.phone,
        petType: data.petType,
        plan: data.plan,
        breederName: data.breederName,
        introduction: data.introduction,
        city: data.city,
        district: data.district,
        breeds: data.breeds,
        level: data.level,
        marketingAgreed: data.marketingAgreed,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Registration failed.");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder registration error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during registration.");
  }
};

/** 브리더 인증 서류 업로드 DTO */
export interface UploadedVerificationDocument {
  type: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface VerificationDocumentsResponseDto {
  uploadedDocuments: UploadedVerificationDocument[];
  allDocuments: UploadedVerificationDocument[];
}

/** 브리더 인증 서류 업로드 API */
export const uploadVerificationDocuments = async (
  files: File[],
  types: string[]
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

    // multipart/form-data 요청
    // ⚠️ Content-Type을 명시하지 않으면 axios가 자동으로 boundary를 포함한 올바른 헤더를 설정합니다
    const response = await apiClient.post<
      ApiResponse<VerificationDocumentsResponseDto>
    >("/api/upload/verification-documents", formData);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message ?? "Document upload failed."
      );
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

/** 프로필 이미지 업로드 API */
export const uploadProfileImage = async (
  file: File
): Promise<string> => {
  try {
    // FormData 생성
    const formData = new FormData();
    formData.append("file", file);

    // multipart/form-data 요청
    const response = await apiClient.post<
      ApiResponse<{ url: string; filename: string; size: number }>
    >("/api/upload/profile", formData);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message ?? "Profile image upload failed."
      );
    }

    // CDN URL 반환
    return response.data.data.url;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile image upload error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during profile image upload.");
  }
};

/** 새로운 브리더 회원가입 API (신규 엔드포인트) */
export const registerBreeder = async (
  data: RegisterBreederDto
): Promise<RegisterBreederResponseDto> => {
  try {
    const response = await apiClient.post<
      ApiResponse<RegisterBreederResponseDto>
    >("/api/auth/register/breeder", data);

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message ?? "Breeder registration failed."
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

/** 브리더 프로필 조회 API */
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
