/**
 * Google Analytics 트래킹 훅
 *
 * 컴포넌트에서 간편하게 GA 이벤트를 전송할 수 있도록 하는 커스텀 훅
 */

import { useCallback } from 'react';
import * as analytics from '@/lib/analytics';

export const useAnalytics = () => {
  // 페이지뷰 트래킹
  const trackPageView = useCallback((url: string) => {
    analytics.pageview(url);
  }, []);

  // 커스텀 이벤트 트래킹
  const trackEvent = useCallback((action: string, params?: Record<string, any>) => {
    analytics.event(action, params);
  }, []);

  // 회원가입 트래킹
  const trackSignUp = useCallback((method: string, userType: 'adopter' | 'breeder') => {
    analytics.trackSignUp(method, userType);
  }, []);

  // 로그인 트래킹
  const trackLogin = useCallback((method: string, userType: 'adopter' | 'breeder') => {
    analytics.trackLogin(method, userType);
  }, []);

  // 로그아웃 트래킹
  const trackLogout = useCallback(() => {
    analytics.trackLogout();
  }, []);

  // 브리더 프로필 조회 트래킹
  const trackViewBreederProfile = useCallback((breederId: string, breederName: string) => {
    analytics.trackViewBreederProfile(breederId, breederName);
  }, []);

  // 입양 신청 트래킹
  const trackAdoptionApplication = useCallback((breederId: string, petId?: string) => {
    analytics.trackAdoptionApplication(breederId, petId);
  }, []);

  // 입양 신청 완료 트래킹
  const trackAdoptionApplicationComplete = useCallback((applicationId: string) => {
    analytics.trackAdoptionApplicationComplete(applicationId);
  }, []);

  // 즐겨찾기 추가 트래킹
  const trackAddFavorite = useCallback((breederId: string) => {
    analytics.trackAddFavorite(breederId);
  }, []);

  // 즐겨찾기 제거 트래킹
  const trackRemoveFavorite = useCallback((breederId: string) => {
    analytics.trackRemoveFavorite(breederId);
  }, []);

  // 후기 작성 트래킹
  const trackWriteReview = useCallback((breederId: string, reviewType: 'positive' | 'negative') => {
    analytics.trackWriteReview(breederId, reviewType);
  }, []);

  // 검색 트래킹
  const trackSearch = useCallback((searchTerm: string, category?: string) => {
    analytics.trackSearch(searchTerm, category);
  }, []);

  // 반려동물 상세 조회 트래킹
  const trackViewPetDetail = useCallback((petId: string, petName: string) => {
    analytics.trackViewPetDetail(petId, petName);
  }, []);

  // 버튼 클릭 트래킹
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    analytics.trackButtonClick(buttonName, location);
  }, []);

  // 에러 트래킹
  const trackError = useCallback((errorMessage: string, errorLocation: string) => {
    analytics.trackError(errorMessage, errorLocation);
  }, []);

  // 사용자 속성 설정
  const setUserProperties = useCallback((userId: string, properties?: Record<string, any>) => {
    analytics.setUserProperties(userId, properties);
  }, []);

  // 사용자 ID 설정
  const setUserId = useCallback((userId: string) => {
    analytics.setUserId(userId);
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackSignUp,
    trackLogin,
    trackLogout,
    trackViewBreederProfile,
    trackAdoptionApplication,
    trackAdoptionApplicationComplete,
    trackAddFavorite,
    trackRemoveFavorite,
    trackWriteReview,
    trackSearch,
    trackViewPetDetail,
    trackButtonClick,
    trackError,
    setUserProperties,
    setUserId,
  };
};
