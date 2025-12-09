'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBanners, type BannerDto } from '@/lib/home';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomeBanner = () => {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const data = await getBanners();
        setBanners(data);
        setError(null);
      } catch (err) {
        console.error('배너 조회 실패:', err);
        setError('배너를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (banner: BannerDto) => {
    if (banner.linkType === 'external') {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[20rem] md:h-[20rem] lg:h-[30rem] flex items-center justify-center bg-gray-100 animate-pulse">
        <p className="text-body-m text-gray-400">배너 로딩 중...</p>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div className="w-full h-[20rem] md:h-[20rem] lg:h-[30rem] flex items-center justify-center bg-gray-50">
        <p className="text-body-m text-gray-400">{error || '표시할 배너가 없습니다.'}</p>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  const renderBannerContent = () => (
    <div className="relative w-full h-full">
      <Image
        src={currentBanner.imageUrl}
        alt={currentBanner.title || '배너 이미지'}
        fill
        className="object-cover"
        priority
      />
      {(currentBanner.title || currentBanner.description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          {currentBanner.title && (
            <h2 className="text-heading-2 md:text-heading-1 font-semibold text-white mb-2">{currentBanner.title}</h2>
          )}
          {currentBanner.description && (
            <p className="text-body-m md:text-body-l text-white/90">{currentBanner.description}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-[20rem] md:h-[20rem] lg:h-[30rem] overflow-hidden">
      {currentBanner.linkType === 'internal' ? (
        <Link href={currentBanner.linkUrl} className="block w-full h-full">
          {renderBannerContent()}
        </Link>
      ) : (
        <button onClick={() => handleBannerClick(currentBanner)} className="w-full h-full cursor-pointer">
          {renderBannerContent()}
        </button>
      )}

      {/* 이전/다음 버튼 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`${index + 1}번째 배너로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBanner;
