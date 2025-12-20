import apiClient from './api';

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 입양자 프로필 응답 DTO (백엔드 응답) */
export interface AdopterProfileDto {
  adopterId: string;
  emailAddress: string;
  nickname: string;
  phoneNumber?: string;
  profileImageFileName?: string;
  accountStatus: string;
  authProvider: 'local' | 'google' | 'kakao' | 'naver' | 'apple';
  marketingAgreed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 입양자 프로필 수정 요청 DTO */
export interface AdopterProfileUpdateRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
  marketingConsent?: boolean;
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
    const response = await apiClient.get<ApiResponse<AdopterProfileDto>>('/api/adopter/profile');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch adopter profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch adopter profile error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during adopter profile fetch');
  }
};

/**
 * 입양자 프로필 수정
 * PATCH /api/adopter/profile
 */
export const updateAdopterProfile = async (
  updateData: AdopterProfileUpdateRequest,
): Promise<AdopterProfileUpdateDto> => {
  try {
    const response = await apiClient.patch<ApiResponse<AdopterProfileUpdateDto>>('/api/adopter/profile', updateData);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update adopter profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update adopter profile error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during adopter profile update');
  }
};

/** 입양자 회원 탈퇴 사유 (백엔드 AdopterWithdrawReason과 동기화) */
export enum WithdrawReason {
  ALREADY_ADOPTED = 'already_adopted',
  NO_SUITABLE_PET = 'no_suitable_pet',
  ADOPTION_FEE_BURDEN = 'adoption_fee_burden',
  UNCOMFORTABLE_UI = 'uncomfortable_ui',
  PRIVACY_CONCERN = 'privacy_concern',
  OTHER = 'other',
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
export const deleteAccount = async (deleteData: AccountDeleteRequest): Promise<AccountDeleteResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<AccountDeleteResponse>>('/api/adopter/account', {
      data: deleteData,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to delete account');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Delete account error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during account deletion');
  }
};

/** 즐겨찾기 추가 응답 DTO */
export interface FavoriteAddResponseDto {
  favoriteId: string;
  breederId: string;
  message: string;
}

/** 즐겨찾기 삭제 응답 DTO */
export interface FavoriteRemoveResponseDto {
  breederId: string;
  message: string;
}

/** 즐겨찾기 아이템 DTO */
export interface FavoriteItemDto {
  breederId: string;
  breederName: string;
  profileImage?: string; // ✅ profileImageFileName → profileImage (Signed URL)
  representativePhotos?: string[]; // ✅ 대표 사진 배열 (Signed URLs)
  location: string;
  specialization?: string[]; // ✅ 품종 배열 (예: ["골든리트리버", "푸들"])
  averageRating: number;
  totalReviews: number;
  availablePets?: number;
  addedAt: string;
  isActive?: boolean;
}

/** 즐겨찾기 목록 응답 DTO */
export interface FavoritesListResponseDto {
  items: FavoriteItemDto[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * 즐겨찾기 목록 조회
 * GET /api/adopter/favorites
 */
export const getFavorites = async (page: number = 1, limit: number = 20): Promise<FavoritesListResponseDto> => {
  try {
    const response = await apiClient.get<ApiResponse<FavoritesListResponseDto>>('/api/adopter/favorites', {
      params: { page, limit },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch favorites');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch favorites error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during favorites fetch');
  }
};

/**
 * 즐겨찾기 추가
 * POST /api/adopter/favorite
 */
export const addFavorite = async (breederId: string): Promise<FavoriteAddResponseDto> => {
  try {
    const response = await apiClient.post<ApiResponse<FavoriteAddResponseDto>>('/api/adopter/favorite', { breederId });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to add favorite');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Add favorite error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during add favorite');
  }
};

/**
 * 즐겨찾기 삭제
 * DELETE /api/adopter/favorite/:breederId
 */
export const removeFavorite = async (breederId: string): Promise<FavoriteRemoveResponseDto> => {
  try {
    const response = await apiClient.delete<ApiResponse<FavoriteRemoveResponseDto>>(
      `/api/adopter/favorite/${breederId}`,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to remove favorite');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Remove favorite error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during remove favorite');
  }
};

/** 후기 작성 요청 DTO */
export interface ReviewCreateRequestDto {
  applicationId: string;
  reviewType: 'consultation' | 'adoption';
  content: string;
}

/** 후기 작성 응답 DTO */
export interface ReviewCreateResponseDto {
  reviewId: string;
  breederId: string;
  breederName: string;
  adopterId: string;
  adopterName: string;
  applicationId: string;
  reviewType: string;
  content: string;
  createdAt: string;
}

/**
 * 브리더 후기 작성 (입양자용)
 * POST /api/adopter/review
 */
export const createReview = async (reviewData: ReviewCreateRequestDto): Promise<ReviewCreateResponseDto> => {
  try {
    const response = await apiClient.post<ApiResponse<ReviewCreateResponseDto>>('/api/adopter/review', reviewData);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create review');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Create review error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during review creation');
  }
};
