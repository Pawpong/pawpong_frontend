import apiClient from "./api";

/** 백엔드 API 응답 타입 */
export interface BreederCardDto {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  location: string;
  mainBreed: string;
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

/** 프론트엔드 Breeder 타입 */
export interface Breeder {
  id: string;
  avatar: string;
  name: string;
  level: "elite" | "new";
  location: string;
  price: string;
  tags: string[];
  image: string;
  status: "available" | "reserved" | "completed";
  isFavorited?: boolean;
}

/** 브리더 검색 요청 파라미터 (프론트엔드) */
export interface SearchBreederParams {
  page?: number;
  limit?: number;
  petType?: "cat" | "dog"; // 백엔드와 일치시킴
  dogSize?: ("small" | "medium" | "large")[];
  catFurLength?: ("short" | "long")[];
  province?: string[]; // 백엔드와 일치시킴 (광역시/도)
  city?: string[]; // 백엔드와 일치시킴 (시/군/구)
  breeds?: string[];
  isAdoptionAvailable?: boolean;
  breederLevel?: ("new" | "elite")[]; // 백엔드와 일치시킴
  sortBy?: "latest" | "favorite" | "review" | "price_asc" | "price_desc"; // 백엔드와 일치시킴
}

/** 백엔드 페이지네이션 응답 */
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

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 백엔드 DTO를 프론트엔드 Breeder 타입으로 변환
 */
function mapBreederCardToBreeder(dto: BreederCardDto): Breeder {
  // 가격 범위 포맷팅
  let priceDisplay = "상담 후 결정";
  if (dto.priceRange && dto.priceRange.display === "range") {
    const minPrice = dto.priceRange.min.toLocaleString();
    const maxPrice = dto.priceRange.max.toLocaleString();
    priceDisplay = `${minPrice} - ${maxPrice}원`;
  }

  // 입양 가능 여부를 status로 변환
  // 백엔드에서 예약/완료 상태를 반환하지 않으므로 available만 사용
  const status: "available" | "reserved" | "completed" =
    dto.isAdoptionAvailable ? "available" : "completed";

  return {
    id: dto.breederId,
    avatar: dto.profileImage || "/avatar-sample.png",
    name: dto.breederName,
    level: dto.breederLevel,
    location: dto.location,
    price: priceDisplay,
    tags: [dto.mainBreed],
    image: dto.representativePhotos[0] || "/main-img-sample.png",
    status,
    isFavorited: dto.isFavorited,
  };
}

/**
 * 브리더 목록 검색/필터링
 * POST /api/breeder/explore
 */
export const exploreBreeders = async (
  params: SearchBreederParams = {}
): Promise<{
  breeders: Breeder[];
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
    // 백엔드 API 스펙에 맞게 요청 데이터 구성
    const requestBody = {
      petType: params.petType || "dog", // 필수 필드, 기본값 'dog'
      dogSize: params.dogSize,
      catFurLength: params.catFurLength,
      province: params.province,
      city: params.city,
      isAdoptionAvailable: params.isAdoptionAvailable,
      breederLevel: params.breederLevel,
      sortBy: params.sortBy || "latest",
      page: params.page || 1,
      take: params.limit || 20, // limit -> take로 변경
    };

    const response = await apiClient.post<
      ApiResponse<PaginationResponse<BreederCardDto>>
    >("/api/breeder/explore", requestBody);

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeders");
    }

    const { items, pagination } = response.data.data;
    const breeders = items.map(mapBreederCardToBreeder);

    return { breeders, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder explore error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder exploration");
  }
};

/**
 * 인기 브리더 목록 조회
 * GET /api/breeder/popular
 */
export const getPopularBreeders = async (): Promise<Breeder[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BreederCardDto[]>>(
      "/api/breeder/popular"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch popular breeders");
    }

    return response.data.data.map(mapBreederCardToBreeder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Popular breeders error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during popular breeders fetch");
  }
};

/**
 * 브리더 상세 정보 조회
 * GET /api/breeder/:id
 */
export const getBreederProfile = async (breederId: string): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/breeder/${breederId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeder profile");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder profile error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder profile fetch");
  }
};

/**
 * 브리더 후기 목록 조회
 * GET /api/breeder/:id/reviews
 */
export const getBreederReviews = async (
  breederId: string,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/breeder/${breederId}/reviews`,
      {
        params: { page, limit },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeder reviews");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder reviews error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder reviews fetch");
  }
};

/**
 * 브리더 분양 가능 개체 목록 조회
 * GET /api/breeder/:id/pets
 */
export const getBreederPets = async (
  breederId: string,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/breeder/${breederId}/pets`,
      {
        params: { page, limit },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch breeder pets");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Breeder pets error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder pets fetch");
  }
};

/**
 * 브리더 부모견/부모묘 목록 조회
 * GET /api/breeder/:id/parent-pets
 */
export const getParentPets = async (breederId: string): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/breeder/${breederId}/parent-pets`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch parent pets");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Parent pets error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during parent pets fetch");
  }
};

/** 즐겨찾기 브리더 DTO (백엔드 응답) */
export interface FavoriteBreederDto {
  breederId: string;
  breederName: string;
  profileImageFileName?: string;
  location: string;
  specialization?: string;
  averageRating: number;
  totalReviews: number;
  availablePets: number;
  addedAt: string;
}

/**
 * 즐겨찾기 브리더를 프론트엔드 Breeder 타입으로 변환
 */
function mapFavoriteToBreeder(dto: FavoriteBreederDto): Breeder {
  return {
    id: dto.breederId,
    avatar: dto.profileImageFileName || "/avatar-sample.png",
    name: dto.breederName,
    level: "new", // 즐겨찾기 응답에는 level이 없으므로 기본값
    location: dto.location,
    price: "상담 후 결정", // 즐겨찾기 응답에는 가격이 없으므로 기본값
    tags: dto.specialization ? [dto.specialization] : [],
    image: "/main-img-sample.png", // 즐겨찾기 응답에는 대표 이미지가 없으므로 기본값
    status: dto.availablePets > 0 ? "available" : "completed",
  };
}

/**
 * 즐겨찾기 목록 조회
 * GET /api/adopter/favorites
 */
export const getFavorites = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  breeders: Breeder[];
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
    const response = await apiClient.get<
      ApiResponse<PaginationResponse<FavoriteBreederDto>>
    >("/api/adopter/favorites", {
      params: { page, limit },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error("Failed to fetch favorites");
    }

    const { items, pagination } = response.data.data;
    const breeders = items.map(mapFavoriteToBreeder);

    return { breeders, pagination };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Favorites fetch error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during favorites fetch");
  }
};

/**
 * 즐겨찾기 추가
 * POST /api/adopter/favorite
 */
export const addFavorite = async (breederId: string): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/adopter/favorite",
      { breederId }
    );

    if (!response.data.success) {
      throw new Error("Failed to add favorite");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Add favorite error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during add favorite");
  }
};

/**
 * 즐겨찾기 삭제
 * DELETE /api/adopter/favorite/:breederId
 */
export const removeFavorite = async (breederId: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/adopter/favorite/${breederId}`
    );

    if (!response.data.success) {
      throw new Error("Failed to remove favorite");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Remove favorite error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during remove favorite");
  }
};
