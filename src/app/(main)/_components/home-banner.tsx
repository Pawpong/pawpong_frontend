'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBanners, type BannerDto } from '@/api/home';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const HomeBanner = () => {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // 화면 크기 감지 (반응형)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px 미만은 모바일
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const data = await getBanners();

        // 사용자 role 확인
        const userType = isAuthenticated ? user?.role : 'guest';

        console.log('=== 배너 필터링 디버깅 ===');
        console.log('로그인 여부:', isAuthenticated);
        console.log('사용자 정보:', user);
        console.log('사용자 타입:', userType);
        console.log('전체 배너 수:', data.length);
        console.log(
          '배너 데이터:',
          data.map((b) => ({
            bannerId: b.bannerId,
            targetAudience: b.targetAudience,
          })),
        );

        // 배너 필터링: targetAudience가 비어있거나, 현재 사용자 타입을 포함하는 배너만 표시
        const filteredBanners = data.filter((banner) => {
          // targetAudience가 없거나 비어있으면 전체에게 표시
          if (!banner.targetAudience || banner.targetAudience.length === 0) {
            console.log(`배너 ${banner.bannerId}: targetAudience 없음 -> 전체 표시`);
            return true;
          }
          // 현재 사용자 타입이 targetAudience에 포함되어 있으면 표시
          const shouldShow = banner.targetAudience.includes(userType as 'guest' | 'adopter' | 'breeder');
          console.log(
            `배너 ${banner.bannerId}: targetAudience=${banner.targetAudience}, userType=${userType}, 표시=${shouldShow}`,
          );
          return shouldShow;
        });

        console.log('필터링된 배너 수:', filteredBanners.length);
        console.log('=========================');

        setBanners(filteredBanners);
        setError(null);
      } catch (err) {
        console.error('배너 조회 실패:', err);
        setError('배너를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [isAuthenticated, user?.role]);

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
      <div className="w-full aspect-square md:h-[380px] lg:aspect-[1919.21/380] flex items-center justify-center bg-gray-100 animate-pulse">
        <p className="text-body-m text-gray-400">배너 로딩 중...</p>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div className="w-full aspect-square md:h-[380px] lg:aspect-[1919.21/380] flex items-center justify-center bg-gray-50">
        <p className="text-body-m text-gray-400">{error || '표시할 배너가 없습니다.'}</p>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  // 반응형: 모바일이면 mobileImageUrl, 아니면 desktopImageUrl 사용
  const currentImageUrl = isMobile ? currentBanner.mobileImageUrl : currentBanner.desktopImageUrl;

  // 이미지 URL이 없으면 에러 UI 표시
  if (!currentImageUrl) {
    return (
      <div className="w-full aspect-square md:h-[380px] lg:aspect-[1919.21/380] flex items-center justify-center bg-gray-50">
        <p className="text-body-m text-gray-400">배너 이미지를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const renderBannerContent = () => (
    <div className="relative w-full h-full">
      <Image
        src={currentImageUrl}
        alt={currentBanner.title || '배너 이미지'}
        fill
        className="object-cover"
        priority
        unoptimized={currentImageUrl.startsWith('http')}
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
    <div className="relative w-full aspect-square md:h-[380px] lg:aspect-[1919.21/380] overflow-hidden">
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
