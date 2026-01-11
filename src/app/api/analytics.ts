/**
 * Google Analytics 4 (GA4) 트래킹 유틸리티
 *
 * 주요 기능:
 * - 페이지뷰 트래킹
 * - 사용자 이벤트 트래킹
 * - 커스텀 이벤트 전송
 * - 사용자 속성 설정
 */

// GA4 측정 ID
export const GA_MEASUREMENT_ID = 'G-0HJT8CJFGN';

// gtag 타입 정의
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * 페이지뷰 트래킹
 * Next.js 라우팅 시 자동으로 호출되어야 함
 *
 * @param url - 페이지 URL
 */
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
    console.log('[GA4] 페이지뷰 트래킹:', url);
  }
};

/**
 * 커스텀 이벤트 트래킹
 *
 * @param action - 이벤트 액션 (예: 'click', 'submit', 'view')
 * @param params - 이벤트 파라미터
 */
export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params);
    console.log('[GA4] 이벤트 트래킹:', action, params);
  }
};

/**
 * 사용자 속성 설정
 * 로그인 시 사용자 정보 설정
 *
 * @param userId - 사용자 고유 ID
 * @param properties - 사용자 속성
 */
export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...properties,
    });
    console.log('[GA4] 사용자 속성 설정:', userId, properties);
  }
};

/**
 * 사용자 ID 설정
 * 로그인 시 호출
 *
 * @param userId - 사용자 고유 ID
 */
export const setUserId = (userId: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    });
    console.log('[GA4] 사용자 ID 설정:', userId);
  }
};

// ==================== 비즈니스 이벤트 트래킹 ====================

/**
 * 회원가입 이벤트
 *
 * @param method - 가입 방법 ('email', 'kakao', 'naver', 'google')
 * @param userType - 사용자 타입 ('adopter', 'breeder')
 */
export const trackSignUp = (method: string, userType: 'adopter' | 'breeder') => {
  event('sign_up', {
    method,
    user_type: userType,
  });
};

/**
 * 로그인 이벤트
 *
 * @param method - 로그인 방법 ('email', 'kakao', 'naver', 'google')
 * @param userType - 사용자 타입 ('adopter', 'breeder')
 */
export const trackLogin = (method: string, userType: 'adopter' | 'breeder') => {
  event('login', {
    method,
    user_type: userType,
  });
};

/**
 * 로그아웃 이벤트
 */
export const trackLogout = () => {
  event('logout');
};

/**
 * 브리더 프로필 조회 이벤트
 *
 * @param breederId - 브리더 ID
 * @param breederName - 브리더 이름
 */
export const trackViewBreederProfile = (breederId: string, breederName: string) => {
  event('view_breeder_profile', {
    breeder_id: breederId,
    breeder_name: breederName,
  });
};

/**
 * 입양 신청 이벤트
 *
 * @param breederId - 브리더 ID
 * @param petId - 반려동물 ID (선택)
 */
export const trackAdoptionApplication = (breederId: string, petId?: string) => {
  event('adoption_application', {
    breeder_id: breederId,
    pet_id: petId || 'general_consultation',
  });
};

/**
 * 입양 신청 완료 이벤트
 *
 * @param applicationId - 신청 ID
 */
export const trackAdoptionApplicationComplete = (applicationId: string) => {
  event('adoption_application_complete', {
    application_id: applicationId,
  });
};

/**
 * 즐겨찾기 추가 이벤트
 *
 * @param breederId - 브리더 ID
 */
export const trackAddFavorite = (breederId: string) => {
  event('add_to_favorites', {
    breeder_id: breederId,
  });
};

/**
 * 즐겨찾기 제거 이벤트
 *
 * @param breederId - 브리더 ID
 */
export const trackRemoveFavorite = (breederId: string) => {
  event('remove_from_favorites', {
    breeder_id: breederId,
  });
};

/**
 * 후기 작성 이벤트
 *
 * @param breederId - 브리더 ID
 * @param reviewType - 후기 타입 ('positive', 'negative')
 */
export const trackWriteReview = (breederId: string, reviewType: 'positive' | 'negative') => {
  event('write_review', {
    breeder_id: breederId,
    review_type: reviewType,
  });
};

/**
 * 검색 이벤트
 *
 * @param searchTerm - 검색어
 * @param category - 검색 카테고리 ('breeder', 'pet', 'breed')
 */
export const trackSearch = (searchTerm: string, category?: string) => {
  event('search', {
    search_term: searchTerm,
    category: category || 'all',
  });
};

/**
 * 반려동물 상세 조회 이벤트
 *
 * @param petId - 반려동물 ID
 * @param petName - 반려동물 이름
 */
export const trackViewPetDetail = (petId: string, petName: string) => {
  event('view_pet_detail', {
    pet_id: petId,
    pet_name: petName,
  });
};

/**
 * 버튼 클릭 이벤트
 *
 * @param buttonName - 버튼 이름
 * @param location - 버튼 위치
 */
export const trackButtonClick = (buttonName: string, location: string) => {
  event('button_click', {
    button_name: buttonName,
    location,
  });
};

/**
 * 페이지 스크롤 이벤트 (90% 스크롤 시)
 *
 * @param pagePath - 페이지 경로
 */
export const trackPageScroll = (pagePath: string) => {
  event('page_scroll_90', {
    page_path: pagePath,
  });
};

/**
 * 에러 이벤트
 *
 * @param errorMessage - 에러 메시지
 * @param errorLocation - 에러 발생 위치
 */
export const trackError = (errorMessage: string, errorLocation: string) => {
  event('error', {
    error_message: errorMessage,
    error_location: errorLocation,
  });
};
