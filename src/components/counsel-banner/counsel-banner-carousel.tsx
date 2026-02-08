'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveCounselBanners, type CounselBanner } from '@/api/counsel-banner';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/loading-state';

export default function CounselBannerCarousel() {
  const [banners, setBanners] = useState<CounselBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Fetch active banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveCounselBanners();
        const sortedBanners = data.sort((a, b) => a.order - b.order);
        setBanners(sortedBanners);
      } catch (error) {
        console.error('Failed to fetch counsel banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (banner: CounselBanner) => {
    if (!banner.linkUrl) return;

    if (banner.linkType === 'external') {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(banner.linkUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-tertiary-500">
        <LoadingState message="로딩 중..." />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-tertiary-500">
        <p className="text-body-s text-grayscale-gray5">배너가 없습니다</p>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-full group">
      {/* Banner Image */}
      <div
        className={`relative w-full h-full overflow-hidden rounded-[20px] ${currentBanner.linkUrl ? 'cursor-pointer' : ''}`}
        onClick={() => currentBanner.linkUrl && handleBannerClick(currentBanner)}
      >
        <Image
          src={currentBanner.imageUrl}
          alt={currentBanner.title || '상담 배너'}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="100vw"
          unoptimized={currentBanner.imageUrl.startsWith('http')}
        />
      </div>

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Indicators - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`배너 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
