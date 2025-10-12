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

/** 브리더 회원가입 완료 */
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
