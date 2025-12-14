'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface ProfileBanner {
  bannerId: string;
  imageUrl: string;
  linkType: 'internal' | 'external';
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function SignupProfileBannerDisplay() {
  const [banners, setBanners] = useState<ProfileBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: ProfileBanner[];
        }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register-banners`);

        if (response.data.success && response.data.data) {
          // order로 정렬
          const sortedBanners = response.data.data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setBanners(sortedBanners);
        }
      } catch (error) {
        console.error('Failed to fetch profile banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerClick = (banner: ProfileBanner) => {
    if (!banner.linkUrl) return;

    if (banner.linkType === 'external') {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = banner.linkUrl;
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
    <div className="relative bg-primary-600 h-full overflow-hidden">
      {/* 배너 이미지 */}
      <div
        className={`relative w-full h-full ${currentBanner.linkUrl ? 'cursor-pointer' : ''}`}
        onClick={() => currentBanner.linkUrl && handleBannerClick(currentBanner)}
      >
        <Image
          src={currentBanner.imageUrl}
          alt={`Profile Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      {/* 인디케이터 (배너가 2개 이상일 때만 표시) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`배너 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
