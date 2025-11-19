import apiClient from "./api";

/** 배너 응답 타입 (백엔드 DTO와 일치) */
export interface BannerDto {
  bannerId: string;
  imageUrl: string;
  linkType: "internal" | "external";
  linkUrl: string;
  title?: string;
  description?: string;
  order: number;
}

/** FAQ 응답 타입 (백엔드 DTO와 일치) */
export interface FaqDto {
  faqId: string;
  question: string;
  answer: string;
  category: string;
  userType: "adopter" | "breeder";
  order: number;
}

/** API 응답 래퍼 타입 */
interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * 활성화된 배너 목록 조회
 */
export const getBanners = async (): Promise<BannerDto[]> => {
  const response = await apiClient.get<ApiResponse<BannerDto[]>>(
    "/home/banners"
  );
  return response.data.data;
};

/**
 * 입양자용 FAQ 목록 조회
 */
export const getAdopterFaqs = async (): Promise<FaqDto[]> => {
  const response = await apiClient.get<ApiResponse<FaqDto[]>>(
    "/home/faqs/adopter"
  );
  return response.data.data;
};

/**
 * 브리더용 FAQ 목록 조회
 */
export const getBreederFaqs = async (): Promise<FaqDto[]> => {
  const response = await apiClient.get<ApiResponse<FaqDto[]>>(
    "/home/faqs/breeder"
  );
  return response.data.data;
};
