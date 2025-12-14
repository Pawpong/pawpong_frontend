import apiClient from './api';

/**
 * 프로필 배너 인터페이스
 */
export interface ProfileBanner {
  bannerId: string;
  imageUrl: string;
  imageFileName: string;
  linkType?: 'internal' | 'external';
  linkUrl?: string;
  title?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

/**
 * 활성화된 프로필 배너 목록 조회
 * 로그인 페이지와 프로필 페이지에 표시할 배너
 */
export async function getActiveProfileBanners(): Promise<ProfileBanner[]> {
  const response = await apiClient.get<{ data: ProfileBanner[] }>(
    '/api/breeder-management-admin/profile-banners/active',
  );
  return response.data.data;
}
