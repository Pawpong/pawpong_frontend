import apiClient from './api';

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 페이지네이션 응답 */
interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/** 브리더 위치 정보 DTO */
export interface BreederLocationDto {
  cityName: string;
  districtName: string;
  detailAddress?: string;
}

/** 브리더 가격대 정보 DTO */
export interface BreederPriceRangeDto {
  minPrice: number;
  maxPrice: number;
}

/** 브리더 프로필 상세 정보 DTO */
export interface BreederProfileInfoDto {
  profileDescription: string;
  locationInfo: BreederLocationDto;
  profilePhotos: string[];
  priceRangeInfo: BreederPriceRangeDto;
  specializationAreas: string[];
  experienceYears?: number;
}

/** 브리더 통계 정보 DTO */
export interface BreederStatsDto {
  totalApplicationCount: number;
  completedAdoptionCount: number;
  averageRatingScore: number;
  totalReviewCount: number;
  profileViewCount: number;
}

/** 브리더 인증 정보 DTO */
export interface BreederVerificationDto {
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

/** 브리더 프로필 응답 DTO */
export interface BreederProfileResponseDto {
  breederId: string;
  breederName: string;
  breederEmail: string;
  authProvider?: 'local' | 'google' | 'kakao' | 'naver' | 'apple';
  marketingAgreed?: boolean;
  profileImageFileName?: string;
  profileInfo: BreederProfileInfoDto;
  parentPetInfo: any[];
  availablePetInfo: any[];
  reviewInfo: any[];
  statsInfo: BreederStatsDto;
  verificationInfo: BreederVerificationDto;
}

/** 브리더 프로필 수정 요청 DTO */
export interface ProfileUpdateRequestDto {
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

/** 브리더 프로필 수정 응답 DTO */
export interface BreederProfileUpdateResponseDto {
  breederId: string;
  updatedFields: string[];
  message: string;
}

/**
 * 브리더 상세 정보 조회 (공개 API)
 * GET /api/breeder/:breederId
 */
export const getBreederProfile = async (breederId: string): Promise<BreederProfileResponseDto> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederProfileResponseDto>>(`/api/breeder/${breederId}`);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch breeder profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch breeder profile error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder profile fetch');
  }
};

/**
 * 인증된 브리더의 자신의 프로필 조회
 * GET /api/breeder-management/profile
 */
export const getMyBreederProfile = async (): Promise<BreederProfileResponseDto> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederProfileResponseDto>>('/api/breeder-management/profile');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch my breeder profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch my breeder profile error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during my breeder profile fetch');
  }
};

/**
 * 브리더 프로필 수정
 * PATCH /api/breeder-management/profile
 */
export const updateBreederProfile = async (
  updateData: ProfileUpdateRequestDto,
): Promise<BreederProfileUpdateResponseDto> => {
  try {
    const response = await apiClient.patch<ApiResponse<BreederProfileUpdateResponseDto>>(
      '/api/breeder-management/profile',
      updateData,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update breeder profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update breeder profile error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder profile update');
  }
};

/** 브리더 대시보드 응답 DTO */
export interface BreederDashboardResponseDto {
  breederInfo: {
    breederId: string;
    name: string;
    level: string;
  };
  statistics: {
    totalPets: number;
    availablePets: number;
    totalApplications: number;
    pendingApplications: number;
  };
  recentActivities: any[];
}

/** 브리더 카드 DTO (탐색/검색 결과) */
export interface Breeder {
  breederId: string;
  breederName: string;
  breederLevel: string;
  location: string;
  mainBreed: string;
  specializationTypes?: string[]; // 전문 분야 (옵셔널)
  isAdoptionAvailable: boolean;
  priceRange?: {
    min: number;
    max: number;
    display: string;
  };
  favoriteCount: number;
  isFavorited: boolean;
  representativePhotos: string[];
  profileImage?: string;
  totalReviews: number;
  averageRating: number;
  createdAt: string;
}

/** 브리더 검색 파라미터 */
export interface SearchBreederParams {
  petType?: 'dog' | 'cat';
  dogSize?: string[];
  catFurLength?: string[];
  breeds?: string[];
  province?: string[];
  city?: string[];
  isAdoptionAvailable?: boolean;
  breederLevel?: string[];
  sortBy?: 'latest' | 'favorite' | 'review' | 'price_asc' | 'price_desc';
  page?: number;
  take?: number;
  /** @deprecated use take instead */
  limit?: number;
}

/**
 * 브리더 대시보드 조회
 * GET /api/breeder-management/dashboard
 */
export const getBreederDashboard = async (): Promise<BreederDashboardResponseDto> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederDashboardResponseDto>>('/api/breeder-management/dashboard');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch breeder dashboard');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch breeder dashboard error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder dashboard fetch');
  }
};

/**
 * 브리더 탐색/검색
 * POST /api/breeder/explore
 */
export const exploreBreeders = async (params: SearchBreederParams = {}): Promise<PaginationResponse<Breeder>> => {
  try {
    const response = await apiClient.post<ApiResponse<PaginationResponse<Breeder>>>('/api/breeder/explore', params);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to explore breeders');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Explore breeders error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder exploration');
  }
};

/**
 * 인기 브리더 목록 조회
 * GET /api/breeder/popular
 */
export const getPopularBreeders = async (): Promise<Breeder[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Breeder[]>>('/api/breeder/popular');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch popular breeders');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch popular breeders error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during popular breeders fetch');
  }
};

/** 받은 입양 신청 아이템 DTO (브리더용) */
export interface ReceivedApplicationItemDto {
  applicationId: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  petId?: string;
  petName?: string;
  status: 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';
  applicationData: {
    privacyConsent: boolean;
    selfIntroduction: string;
    familyMembers: string;
    allFamilyConsent: boolean;
    allergyTestInfo: string;
    timeAwayFromHome: string;
    livingSpaceDescription: string;
    previousPetExperience: string;
  };
  appliedAt: string;
  processedAt?: string;
  breederNotes?: string;
}

/**
 * 받은 입양 신청 목록 조회 (브리더용)
 * GET /api/breeder-management/applications
 */
export const getReceivedApplications = async (
  page: number = 1,
  take: number = 10,
): Promise<{
  applications: ReceivedApplicationItemDto[];
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
    const response = await apiClient.get<ApiResponse<PaginationResponse<ReceivedApplicationItemDto>>>(
      '/api/breeder-management/applications',
      {
        params: { page, take },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch received applications');
    }

    const { items, pagination } = response.data.data;

    return { applications: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch received applications error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during received applications fetch');
  }
};

/**
 * 받은 입양 신청 상세 조회 (브리더용)
 * GET /api/breeder-management/applications/:applicationId
 */
export const getReceivedApplicationDetail = async (applicationId: string): Promise<ReceivedApplicationItemDto> => {
  try {
    const response = await apiClient.get<ApiResponse<ReceivedApplicationItemDto>>(
      `/api/breeder-management/applications/${applicationId}`,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch received application detail');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch received application detail error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during received application detail fetch');
  }
};

/**
 * 브리더 분양 가능 개체 목록 조회
 * GET /api/breeder/:breederId/pets
 */
export const getBreederPets = async (
  breederId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ items: any[]; pagination: any }> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginationResponse<any>>>(
      `/api/breeder/${breederId}/pets`,
      { params: { page, limit } },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch breeder pets');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch breeder pets error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder pets fetch');
  }
};

/**
 * 브리더 부모견/부모묘 목록 조회
 * GET /api/breeder/:breederId/parent-pets
 */
export const getParentPets = async (breederId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>(`/api/breeder/${breederId}/parent-pets`);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch parent pets');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch parent pets error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during parent pets fetch');
  }
};

/**
 * 브리더 후기 목록 조회
 * GET /api/breeder/:breederId/reviews
 */
export const getBreederReviews = async (
  breederId: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ items: any[]; pagination: any }> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginationResponse<any>>>(
      `/api/breeder/${breederId}/reviews`,
      { params: { page, limit } },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch breeder reviews');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch breeder reviews error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder reviews fetch');
  }
};
