import apiClient from './api';

/** 배너 응답 타입 (백엔드 DTO와 일치) */
export interface BannerDto {
  bannerId: string;
  desktopImageUrl: string; // PC/Pad 버전 이미지 URL
  mobileImageUrl: string; // 모바일 버전 이미지 URL
  desktopImageFileName: string; // PC/Pad 버전 파일명
  mobileImageFileName: string; // 모바일 버전 파일명
  linkType: 'internal' | 'external';
  linkUrl: string;
  title?: string;
  description?: string;
  order: number;
  targetAudience?: ('guest' | 'adopter' | 'breeder')[]; // 표시 대상
}

/** FAQ 응답 타입 (백엔드 DTO와 일치) */
export interface FaqDto {
  faqId: string;
  question: string;
  answer: string;
  category: string;
  userType: 'adopter' | 'breeder';
  order: number;
}

/** 분양중인 아이들 응답 타입 */
export interface AvailablePetDto {
  petId: string;
  name: string;
  birthDate: string;
  breed: string;
  breederId: string;
  breederName: string;
  price: number | null; // 비로그인 시 null
  mainPhoto: string;
  birthDate: string | null; // 생년월일
  ageInMonths: number;
  location: {
    city: string;
    district: string;
  };
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
 * GET /api/home/banners
 */
export const getBanners = async (): Promise<BannerDto[]> => {
  const response = await apiClient.get<ApiResponse<BannerDto[]>>('/api/home/banners');
  return response.data.data;
};

/**
 * 입양자용 FAQ 목록 조회
 * GET /api/home/faqs?userType=adopter
 */
export const getAdopterFaqs = async (): Promise<FaqDto[]> => {
  const response = await apiClient.get<ApiResponse<FaqDto[]>>('/api/home/faqs', {
    params: { userType: 'adopter' },
  });
  return response.data.data;
};

/**
 * 브리더용 FAQ 목록 조회
 * GET /api/home/faqs?userType=breeder
 */
export const getBreederFaqs = async (): Promise<FaqDto[]> => {
  const response = await apiClient.get<ApiResponse<FaqDto[]>>('/api/home/faqs', {
    params: { userType: 'breeder' },
  });
  return response.data.data;
};

/**
 * 분양중인 아이들 조회
 * GET /api/home/available-pets
 */
export const getAvailablePets = async (limit: number = 10): Promise<AvailablePetDto[]> => {
  try {
    const response = await apiClient.get<ApiResponse<AvailablePetDto[]>>('/api/home/available-pets', {
      params: { limit },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch available pets');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Available pets fetch error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during available pets fetch');
  }
};
