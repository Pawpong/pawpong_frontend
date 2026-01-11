'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import apiClient from '@/api/api';

interface CounselBanner {
  bannerId: string;
  imageUrl: string;
  linkType?: 'internal' | 'external';
  linkUrl?: string;
  order: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 활성화된 상담 배너 조회
 * GET /api/breeder-management-admin/counsel-banners/active
 */
const getActiveCounselBanners = async (): Promise<CounselBanner[]> => {
  try {
    const response = await apiClient.get<ApiResponse<CounselBanner[]>>(
      '/api/breeder-management-admin/counsel-banners/active',
    );

    if (!response.data.success || !response.data.data) {
      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error('상담 배너 조회 실패:', error);
    return [];
  }
};

export default function CounselBannerDisplay() {
  const [banners, setBanners] = useState<CounselBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getActiveCounselBanners();
      setBanners(data);
      setIsLoading(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5초마다 배너 전환

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerClick = () => {
    const currentBanner = banners[currentIndex];
    if (!currentBanner?.linkUrl) return;

    if (currentBanner.linkType === 'external') {
      window.open(currentBanner.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = currentBanner.linkUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="relative bg-primary-600 h-full flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return <div className="relative bg-primary-600 h-full" />;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div
      className={`relative bg-primary-600 h-full overflow-hidden ${currentBanner?.linkUrl ? 'cursor-pointer' : ''}`}
      onClick={handleBannerClick}
    >
      <Image
        src={currentBanner.imageUrl}
        alt={`상담 배너 ${currentIndex + 1}`}
        fill
        className="object-cover"
        priority={currentIndex === 0}
      />
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`배너 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
