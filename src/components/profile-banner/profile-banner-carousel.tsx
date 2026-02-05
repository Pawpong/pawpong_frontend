'use client';

import { useEffect, useState } from 'react';
import { getActiveProfileBanners, type ProfileBanner } from '@/api/profile-banner';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingText } from '@/components/loading-state';

export default function ProfileBannerCarousel() {
  const [banners, setBanners] = useState<ProfileBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveProfileBanners();
        const sortedBanners = data.sort((a, b) => a.order - b.order);
        setBanners(sortedBanners);
      } catch (error) {
        console.error('프로필 배너 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-primary-500 rounded-2xl animate-pulse flex items-center justify-center">
        <LoadingText message="로딩 중..." className="text-white text-sm" />
      </div>
    );
  }

  if (banners.length === 0) {
    return <div className="h-full w-full bg-primary-500 rounded-2xl" />;
  }

  const currentBanner = banners[currentIndex];

  const BannerContent = () => (
    <div className="relative h-full w-full bg-primary-500 rounded-2xl overflow-hidden group">
      <Image
        src={currentBanner.imageUrl}
        alt={currentBanner.title || '프로필 배너'}
        fill
        className="object-cover"
        priority
      />

      {/* 네비게이션 버튼 (배너가 2개 이상일 때만 표시) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`${index + 1}번 배너로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  // 링크가 있는 경우 Link로 감싸기
  if (currentBanner.linkUrl) {
    if (currentBanner.linkType === 'external') {
      return (
        <a href={currentBanner.linkUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full block">
          <BannerContent />
        </a>
      );
    } else {
      return (
        <Link href={currentBanner.linkUrl} className="h-full w-full block">
          <BannerContent />
        </Link>
      );
    }
  }

  return <BannerContent />;
}
