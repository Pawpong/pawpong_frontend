import apiClient from './api';

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 브리더 프로필 업데이트 요청 */
export interface ProfileUpdateRequest {
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
  marketingAgreed?: boolean;
}

/** 부모 반려동물 추가 요청 */
export interface ParentPetAddRequest {
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD 형식
  photoFileName: string;
  description?: string;
}

/** 분양 가능 반려동물 추가 요청 */
export interface AvailablePetAddRequest {
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD 형식
  price: number;
  description?: string;
  parentInfo?: {
    mother?: string;
    father?: string;
  };
}

/**
 * 브리더 프로필 조회
 * GET /api/breeder-management/profile
 */
export const getBreederProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/api/breeder-management/profile');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch breeder profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Breeder profile fetch error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder profile fetch');
  }
};

/**
 * 브리더 프로필 수정
 * PATCH /api/breeder-management/profile
 */
export const updateBreederProfile = async (data: ProfileUpdateRequest): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>('/api/breeder-management/profile', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update breeder profile');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Breeder profile update error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder profile update');
  }
};

/**
 * 부모 반려동물 추가
 * POST /api/breeder-management/parent-pets
 */
export const addParentPet = async (data: ParentPetAddRequest): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/breeder-management/parent-pets', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to add parent pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Add parent pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during add parent pet');
  }
};

/**
 * 부모 반려동물 수정
 * PATCH /api/breeder-management/parent-pets/:petId
 */
export const updateParentPet = async (petId: string, data: Partial<ParentPetAddRequest>): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(`/api/breeder-management/parent-pets/${petId}`, data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update parent pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update parent pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during update parent pet');
  }
};

/**
 * 부모 반려동물 삭제
 * DELETE /api/breeder-management/parent-pets/:petId
 */
export const deleteParentPet = async (petId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(`/api/breeder-management/parent-pets/${petId}`);

    if (!response.data.success) {
      throw new Error('Failed to delete parent pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Delete parent pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during delete parent pet');
  }
};

/**
 * 분양 가능 반려동물 추가
 * POST /api/breeder-management/available-pets
 */
export const addAvailablePet = async (data: AvailablePetAddRequest): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/breeder-management/available-pets', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to add available pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Add available pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during add available pet');
  }
};

/**
 * 분양 가능 반려동물 수정
 * PATCH /api/breeder-management/available-pets/:petId
 */
export const updateAvailablePet = async (petId: string, data: Partial<AvailablePetAddRequest>): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(`/api/breeder-management/available-pets/${petId}`, data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update available pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update available pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during update available pet');
  }
};

/**
 * 분양 가능 반려동물 삭제
 * DELETE /api/breeder-management/available-pets/:petId
 */
export const deleteAvailablePet = async (petId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(`/api/breeder-management/available-pets/${petId}`);

    if (!response.data.success) {
      throw new Error('Failed to delete available pet');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Delete available pet error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during delete available pet');
  }
};

/**
 * 반려동물 상태 변경
 * PATCH /api/breeder-management/available-pets/:petId/status
 */
export const updatePetStatus = async (petId: string, petStatus: 'available' | 'reserved' | 'adopted'): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(`/api/breeder-management/available-pets/${petId}/status`, {
      petStatus,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update pet status');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update pet status error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during update pet status');
  }
};

/** 대시보드 응답 DTO */
export interface DashboardResponseDto {
  breederId: string;
  breederName: string;
  verificationStatus: string;
  stats: {
    totalReviews: number;
    averageRating: number;
    totalApplications: number;
    pendingApplications: number;
    totalPets: number;
    availablePets: number;
  };
  recentApplications: Array<{
    applicationId: string;
    adopterName: string;
    petName?: string;
    status: string;
    appliedAt: string;
  }>;
  recentReviews: Array<{
    reviewId: string;
    adopterName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

/**
 * 브리더 대시보드 조회
 * GET /api/breeder-management/dashboard
 */
export const getDashboard = async (): Promise<DashboardResponseDto> => {
  try {
    const response = await apiClient.get<ApiResponse<DashboardResponseDto>>('/api/breeder-management/dashboard');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch dashboard');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch dashboard error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during dashboard fetch');
  }
};

/** 인증 상태 응답 DTO */
export interface VerificationStatusDto {
  breederId: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'not_submitted';
  level?: 'new' | 'elite';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  submittedByEmail?: boolean;
  documents?: Array<{
    type: string;
    url: string;
    originalFileName?: string;
    uploadedAt?: string;
  }>;
}

/**
 * 브리더 인증 상태 조회
 * GET /api/breeder-management/verification
 */
export const getVerificationStatus = async (): Promise<VerificationStatusDto> => {
  try {
    const response = await apiClient.get<ApiResponse<VerificationStatusDto>>('/api/breeder-management/verification');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch verification status');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch verification status error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during verification status fetch');
  }
};

/** 인증 신청 요청 DTO */
export interface VerificationSubmitRequest {
  documents: Array<{
    type: string;
    url: string;
  }>;
}

/**
 * 브리더 인증 신청
 * POST /api/breeder-management/verification
 */
export const submitVerification = async (data: VerificationSubmitRequest): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/breeder-management/verification', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to submit verification');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Submit verification error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during verification submission');
  }
};

/** 업로드된 문서 응답 DTO */
export interface UploadedDocumentDto {
  type: string;
  url: string;
  fileName: string;
  size: number;
}

/** 서류 업로드 응답 DTO */
export interface UploadDocumentsResponseDto {
  count: number;
  level: string;
  documents: UploadedDocumentDto[];
}

/**
 * 브리더 인증 서류 업로드
 * POST /api/breeder-management/verification/upload
 */
export const uploadVerificationDocuments = async (
  files: File[],
  types: string[],
  level: 'new' | 'elite',
): Promise<UploadDocumentsResponseDto> => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('types', JSON.stringify(types));
    formData.append('level', level);

    const response = await apiClient.post<ApiResponse<UploadDocumentsResponseDto>>(
      '/api/breeder-management/verification/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('서류 업로드에 실패했습니다.');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Upload verification documents error:', error.message);
      throw error;
    }
    throw new Error('서류 업로드 중 오류가 발생했습니다.');
  }
};

/** 서류 제출 요청 DTO */
export interface SubmitDocumentsRequest {
  level: 'new' | 'elite';
  documents: Array<{
    type: string;
    fileName: string;
  }>;
  submittedByEmail?: boolean;
}

/**
 * 브리더 인증 서류 제출 (간소화)
 * POST /api/breeder-management/verification/submit
 */
export const submitVerificationDocuments = async (data: SubmitDocumentsRequest): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/breeder-management/verification/submit',
      data,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('서류 제출에 실패했습니다.');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Submit verification documents error:', error.message);
      throw error;
    }
    throw new Error('서류 제출 중 오류가 발생했습니다.');
  }
};

/** 받은 입양 신청 목록 아이템 DTO */
export interface ReceivedApplicationItemDto {
  applicationId: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  petId?: string;
  petName?: string;
  status: 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';
  appliedAt: string;
  processedAt?: string;
}

/** 페이지네이션 응답 */
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

/**
 * 받은 입양 신청 목록 조회
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

/** 받은 입양 신청 상세 DTO */
export interface ReceivedApplicationDetailDto {
  applicationId: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
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
 * 받은 입양 신청 상세 조회
 * GET /api/breeder-management/applications/:applicationId
 */
export const getApplicationDetail = async (applicationId: string): Promise<ReceivedApplicationDetailDto> => {
  try {
    const response = await apiClient.get<ApiResponse<ReceivedApplicationDetailDto>>(
      `/api/breeder-management/applications/${applicationId}`,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch application detail');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch application detail error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during application detail fetch');
  }
};

/** 입양 신청 상태 변경 요청 DTO */
export interface ApplicationStatusUpdateRequest {
  newStatus: 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';
  breederNotes?: string;
}

/**
 * 입양 신청 상태 변경
 * PATCH /api/breeder-management/applications/:applicationId
 */
export const updateApplicationStatus = async (
  applicationId: string,
  data: ApplicationStatusUpdateRequest,
): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/breeder-management/applications/${applicationId}`,
      data,
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update application status');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update application status error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during application status update');
  }
};

/** 내 개체 목록 아이템 DTO */
export interface MyPetItemDto {
  petId: string;
  name: string;
  breed: string;
  breedKo: string;
  birthDate: string;
  gender: 'male' | 'female';
  price: number;
  status: 'available' | 'reserved' | 'adopted';
  photos: string[];
  applicationCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 내 개체 목록 조회
 * GET /api/breeder-management/my-pets
 */
export const getMyPets = async (
  status?: string,
  includeInactive: boolean = false,
  page: number = 1,
  limit: number = 20,
): Promise<{
  pets: MyPetItemDto[];
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
    const response = await apiClient.get<ApiResponse<PaginationResponse<MyPetItemDto>>>(
      '/api/breeder-management/my-pets',
      {
        params: { status, includeInactive, page, limit },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch my pets');
    }

    const { items, pagination } = response.data.data;

    return { pets: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch my pets error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during my pets fetch');
  }
};

/** 내 후기 목록 아이템 DTO */
export interface MyReviewItemDto {
  reviewId: string;
  adopterId: string;
  adopterName: string;
  petId?: string;
  petName?: string;
  rating: number;
  comment: string;
  photos?: string[];
  visibility: 'public' | 'private';
  isReported: boolean;
  createdAt: string;
}

/**
 * 내게 달린 후기 목록 조회
 * GET /api/breeder-management/my-reviews
 */
export const getMyReviews = async (
  visibility: string = 'all',
  page: number = 1,
  limit: number = 10,
): Promise<{
  reviews: MyReviewItemDto[];
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
    const response = await apiClient.get<ApiResponse<PaginationResponse<MyReviewItemDto>>>(
      '/api/breeder-management/my-reviews',
      {
        params: { visibility, page, limit },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch my reviews');
    }

    const { items, pagination } = response.data.data;

    return { reviews: items, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch my reviews error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during my reviews fetch');
  }
};

/** 입양 신청 폼 응답 DTO */
export interface ApplicationFormDto {
  breederId: string;
  breederName: string;
  standardQuestions: Array<{
    id: string;
    type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    order: number;
  }>;
  customQuestions: Array<{
    id: string;
    type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    order: number;
  }>;
}

/**
 * 입양 신청 폼 조회
 * GET /api/breeder-management/application-form
 */
export const getApplicationForm = async (): Promise<ApplicationFormDto> => {
  try {
    const response = await apiClient.get<ApiResponse<ApplicationFormDto>>('/api/breeder-management/application-form');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch application form');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch application form error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during application form fetch');
  }
};

/** 입양 신청 폼 수정 요청 DTO */
export interface ApplicationFormUpdateRequest {
  customQuestions: Array<{
    id: string;
    type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    order: number;
  }>;
}

/**
 * 입양 신청 폼 수정
 * PATCH /api/breeder-management/application-form
 */
export const updateApplicationForm = async (data: ApplicationFormUpdateRequest): Promise<any> => {
  try {
    const response = await apiClient.patch<ApiResponse<any>>('/api/breeder-management/application-form', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update application form');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update application form error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during application form update');
  }
};

/** 브리더 회원 탈퇴 요청 DTO */
export interface BreederAccountDeleteRequest {
  reason?: string;
  otherReason?: string;
}

/** 브리더 회원 탈퇴 응답 DTO */
export interface BreederAccountDeleteResponse {
  breederId: string;
  deletedAt: string;
  message: string;
}

/**
 * 브리더 계정 탈퇴 (소프트 딜리트)
 * DELETE /api/breeder-management/account
 */
export const deleteBreederAccount = async (
  deleteData?: BreederAccountDeleteRequest,
): Promise<BreederAccountDeleteResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<BreederAccountDeleteResponse>>(
      '/api/breeder-management/account',
      {
        data: deleteData,
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to delete breeder account');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Breeder account deletion error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during breeder account deletion');
  }
};
