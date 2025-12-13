'use client';

import { use } from 'react';
import BreederProfile from '@/app/(main)/explore/breeder/[id]/_components/breeder-profile';
import { Separator } from '@/components/ui/separator';
import BreederDescription from './_components/breeder-description';
import BreedingAnimals from './_components/breeding-animals';
import EnvPhotos from './_components/env-photos';
import Parents from './_components/parents';
import Reviews from './_components/reviews';
import Header from '../_components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCounselFormStore } from '@/stores/counsel-form-store';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useBreederProfile, useBreederPets, useParentPets, useBreederReviews } from './_hooks/use-breeder-detail';
import { useAuthStore } from '@/stores/auth-store';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { id: breederId } = use(params);
  const router = useRouter();
  const { clearCounselFormData } = useCounselFormStore();
  const isLg = useBreakpoint('lg');
  const { user } = useAuthStore();

  // 브리더 본인인지 확인
  const isOwnProfile = user?.role === 'breeder' && user?.userId === breederId;

  const { data: profileData, isLoading: isProfileLoading } = useBreederProfile(breederId);
  const { data: petsData, isLoading: isPetsLoading } = useBreederPets(breederId);
  const { data: parentPetsData, isLoading: isParentPetsLoading } = useParentPets(breederId);
  const { data: reviewsData, isLoading: isReviewsLoading } = useBreederReviews(breederId);

  const handleCounselClick = () => {
    clearCounselFormData();
    router.push(`/counselform?breederId=${breederId}`);
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-body-s text-grayscale-gray5">브리더 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 프로필 데이터 매핑
  const profileInfo = profileData.profileInfo;
  const locationStr = profileInfo?.locationInfo
    ? `${profileInfo.locationInfo.cityName} ${profileInfo.locationInfo.districtName}`
    : '';
  // API 응답에서 직접 priceRange 추출 (백엔드가 priceRange: { min, max } 형식으로 반환)
  const apiPriceRange = (profileData as any)?.priceRange;
  const priceRangeStr = apiPriceRange?.min || apiPriceRange?.max
    ? `${apiPriceRange.min?.toLocaleString()} - ${apiPriceRange.max?.toLocaleString()}원`
    : '상담 후 결정';

  // API 응답에서 직접 값 추출 (profileImage, location, breederLevel 등)
  const apiData = profileData as any;
  const avatarUrl = apiData?.profileImage || profileData.profileImageFileName || '/avatar-sample.png';
  const locationFromApi = apiData?.location || locationStr;
  const levelFromApi = apiData?.breederLevel === 'elite' ? 'elite' : 'new';

  const breederProfileData = {
    avatarUrl,
    nickname: profileData.breederName,
    level: levelFromApi as 'new' | 'elite',
    location: locationFromApi,
    priceRange: priceRangeStr,
    breeds: profileInfo?.specializationAreas || [],
    animal: 'dog' as const,
  };

  // 환경 사진 - API 응답 구조에 맞게 처리
  const envPhotos = (profileData as any)?.representativePhotos || profileInfo?.profilePhotos || [];

  // 브리더 소개 - API 응답 구조에 맞게 처리
  const breederDescription = (profileData as any)?.description || profileInfo?.profileDescription || '';

  // 분양 가능 개체 매핑
  const breedingAnimals = (petsData?.items || []).map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.mainPhoto || '/animal-sample.png',
    name: pet.name,
    sex: pet.gender,
    birth: pet.birthDate,
    price: `${pet.price.toLocaleString()}원`,
    breed: pet.breed,
  }));

  // 부모견/부모묘 매핑 - 배열 또는 객체 형태 모두 처리
  const parentPetsArray = Array.isArray(parentPetsData)
    ? parentPetsData
    : (parentPetsData as any)?.items || [];
  const parentPets = parentPetsArray.map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.photoUrl || '/animal-sample.png',
    name: pet.name,
    sex: pet.gender,
    birth: pet.birthDate,
    price: '', // 부모견은 가격이 없음
    breed: pet.breed,
  }));

  // 후기 매핑
  const reviews = (reviewsData?.items || []).map((review: any) => {
    // 날짜 필드: 백엔드에서 writtenAt을 반환
    const dateString = review.writtenAt || review.createdAt;
    let formattedDate = '';

    if (dateString) {
      try {
        const date = new Date(dateString);
        // 유효한 날짜인지 확인
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Invalid date format:', dateString, error);
      }
    }

    return {
      id: review.reviewId,
      nickname: review.adopterName || review.adopterNickname || '익명',
      date: formattedDate || '날짜 없음',
      content: review.content,
    };
  });

  return (
    <>
      <Header breederNickname={profileData.breederName} breederId={breederId} />
      <div className="pt-4 lg:flex lg:gap-24.5 space-y-10 md:space-y-15 pb-10 md:pb-15 lg:lg-80">
        <div>
          <BreederProfile data={breederProfileData} breederId={breederId} isOwnProfile={isOwnProfile} />
        </div>
        <div className="space-y-12 mt-10 md:mt-0">
          {envPhotos.length > 0 && (
            <>
              <EnvPhotos photos={envPhotos} />
              <Separator className="my-12" />
            </>
          )}

          {breederDescription && (
            <>
              <BreederDescription data={breederDescription} />
              <Separator className="my-12" />
            </>
          )}

          {!isPetsLoading && breedingAnimals.length > 0 && (
            <>
              <BreedingAnimals data={breedingAnimals} />
              <Separator className="my-12" />
            </>
          )}

          {!isParentPetsLoading && parentPets.length > 0 && (
            <>
              <Parents data={parentPets} />
              <Separator className="my-12" />
            </>
          )}

          {!isReviewsLoading && reviews.length > 0 && <Reviews data={reviews} />}
        </div>
      </div>
      {!isLg && !isOwnProfile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2  w-full max-w-[22.0625rem]">
          <Button
            variant="counsel"
            className="w-full h-12 rounded-lg text-body-s font-semibold text-primary-500"
            type="button"
            onClick={handleCounselClick}
          >
            상담 신청하기
          </Button>
        </div>
      )}
    </>
  );
}
