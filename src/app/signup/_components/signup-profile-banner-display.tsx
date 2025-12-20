'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import SignupProgressOverlay from './signup-progress-overlay';
import signupBackground from '@/assets/images/signup-background.png';

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
        // 404 에러는 배너가 없는 것으로 처리 (정상적인 경우)
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log('배너 API가 없거나 배너가 없습니다.');
        } else {
          console.error('Failed to fetch profile banners:', error);
        }
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
      <div className="relative h-full flex items-center justify-center rounded-2xl overflow-hidden">
        <Image src={signupBackground} alt="Signup Background" fill className="object-cover" priority />
        <div className="relative z-10 text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[20px]">
      {/* 배경 이미지 (항상 표시) */}
      <div className="absolute inset-0">
        <Image src={signupBackground} alt="Signup Background" fill className="object-cover" priority />
      </div>

      {/* 배너 이미지 (배너가 있을 때만 표시) */}
      {banners.length > 0 && (
        <>
          <div
            className={`absolute inset-0 z-10 ${banners[currentIndex].linkUrl ? 'cursor-pointer' : ''}`}
            onClick={() => banners[currentIndex].linkUrl && handleBannerClick(banners[currentIndex])}
          >
            <Image
              src={banners[currentIndex].imageUrl}
              alt={`Profile Banner ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </div>

          {/* 인디케이터 (배너가 2개 이상일 때만 표시) */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
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
        </>
      )}

      {/* 회원가입 진행 단계 오버레이 (항상 표시) */}
      <SignupProgressOverlay />
    </div>
  );
}
