import apiClient from './api';

/**
 * 상담 배너 인터페이스
 */
export interface CounselBanner {
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
 * 활성화된 상담 배너 목록 조회
 * 상담 신청 페이지에 표시할 배너
 */
export async function getActiveCounselBanners(): Promise<CounselBanner[]> {
  const response = await apiClient.get<{ data: CounselBanner[] }>(
    '/api/breeder-management-admin/counsel-banners/active',
  );
  return response.data.data;
}
