import apiClient from './api';

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 지역 정보 */
export interface District {
  city: string;
  districts: string[];
}

/**
 * 모든 지역 데이터 조회
 * GET /api/districts
 */
export const getAllDistricts = async (): Promise<District[]> => {
  try {
    const response = await apiClient.get<ApiResponse<District[]>>('/api/districts');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch districts');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Districts fetch error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during districts fetch');
  }
};
