import apiClient from "./api";

/**
 * Adopter Social Registration DTO (tempId-based)
 */
export interface AdopterRegistrationDto {
  tempId: string;
  email: string;
  name: string;
  nickname: string;
  phone?: string;
  marketingAgreed?: boolean;
}

/**
 * Breeder Social Registration DTO (tempId-based)
 */
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

/**
 * Check Nickname DTO
 */
export interface CheckNicknameDto {
  nickname: string;
}

/**
 * Auth Response DTO
 */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  userInfo: any;
}


/**
 * Check email duplication
 */
export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.post("/api/auth/check-email", { email });
    return response.data.data?.isDuplicate || false;
  } catch (error) {
    console.error("Email duplication check error:", error);
    throw new Error("Failed to check email duplication.");
  }
};

/**
 * Check nickname duplication
 */
export const checkNicknameDuplicate = async (
  nickname: string
): Promise<boolean> => {
  try {
    const response = await apiClient.post("/api/auth/check-nickname", {
      nickname,
    });
    return response.data.data?.isDuplicate || false;
  } catch (error) {
    console.error("Nickname duplication check error:", error);
    throw new Error("Failed to check nickname duplication.");
  }
};

/**
 * Send SMS verification code
 */
export const sendVerificationCode = async (phone: string): Promise<void> => {
  try {
    const cleanPhone = phone.replace(/-/g, "");
    const response = await apiClient.post("/api/auth/phone/send-code", {
      phone: cleanPhone,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send verification code.");
    }
  } catch (error: any) {
    console.error("SMS send error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error occurred while sending verification code.");
  }
};

/**
 * Verify SMS code
 */
export const verifyCode = async (
  phone: string,
  code: string
): Promise<void> => {
  try {
    const cleanPhone = phone.replace(/-/g, "");
    const response = await apiClient.post("/api/auth/phone/verify-code", {
      phone: cleanPhone,
      code,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Verification code does not match.");
    }
  } catch (error: any) {
    console.error("SMS verification error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error occurred during verification.");
  }
};

/**
 * Complete adopter social registration (tempId-based)
 */
export const completeAdopterRegistration = async (
  data: AdopterRegistrationDto
): Promise<AuthResponseDto> => {
  try {
    const response = await apiClient.post("/api/auth/social/complete", {
      tempId: data.tempId,
      email: data.email,
      name: data.name,
      role: "adopter",
      nickname: data.nickname,
      phone: data.phone,
      marketingAgreed: data.marketingAgreed || false,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error("Registration failed.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Adopter registration error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error occurred during registration.");
  }
};

/**
 * Complete breeder social registration (tempId-based)
 */
export const completeBreederRegistration = async (
  data: BreederRegistrationDto
): Promise<AuthResponseDto> => {
  try {
    const response = await apiClient.post("/api/auth/social/complete", {
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
    });

    if (!response.data.success || !response.data.data) {
      throw new Error("Registration failed.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Breeder registration error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error occurred during registration.");
  }
};

