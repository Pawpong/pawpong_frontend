import apiClient from './api';

/**
 * 프로필 배너 인터페이스
 * 관리자가 /content/counsel 에서 등록한 상담 배너
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
 * 활성화된 프로필(상담) 배너 목록 조회
 * 프로필 페이지에 표시할 활성화된 상담 배너
 * API: /api/breeder-management-admin/counsel-banners/active
 */
export async function getActiveProfileBanners(): Promise<ProfileBanner[]> {
  const response = await apiClient.get<{ data: ProfileBanner[] }>(
    '/api/breeder-management-admin/counsel-banners/active',
  );
  return response.data.data;
}
