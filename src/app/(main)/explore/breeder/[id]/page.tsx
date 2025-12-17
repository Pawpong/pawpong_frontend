'use client';

import { use, useState, useEffect } from 'react';
import BreederProfile from '@/app/(main)/explore/breeder/[id]/_components/breeder-profile';
import { Separator } from '@/components/ui/separator';
import BreederDescription from './_components/breeder-description';
import BreedingAnimals from './_components/breeding-animals';
import EnvPhotos from './_components/env-photos';
import Parents from './_components/parents';
import Reviews from './_components/reviews';
import Header from '../_components/header';
import { Button } from '@/components/ui/button';
import {
  SimpleDialog,
  SimpleDialogContent,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogDescription,
  SimpleDialogFooter,
} from '@/components/ui/simple-dialog';
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
  const { user, isAuthenticated } = useAuthStore();

  // 브리더 본인인지 확인
  const isOwnProfile = user?.role === 'breeder' && user?.userId === breederId;
  const isBreeder = user?.role === 'breeder';

  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useBreederProfile(breederId);
  const { data: petsData, isLoading: isPetsLoading } = useBreederPets(breederId);
  const { data: parentPetsData, isLoading: isParentPetsLoading } = useParentPets(breederId, 1, 100);
  const { data: reviewsData, isLoading: isReviewsLoading } = useBreederReviews(breederId);

  // 탈퇴한 브리더 모달 상태
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);
  const [isNotFoundError, setIsNotFoundError] = useState(false);

  // 에러 발생 시 모달 표시
  useEffect(() => {
    if (profileError) {
      console.log('[DEBUG] Profile error detected:', profileError);
      const errorMessage = profileError instanceof Error ? profileError.message : '브리더 정보를 찾을 수 없습니다.';
      console.log('[DEBUG] Error message:', errorMessage);
      const isDeleted = errorMessage.includes('탈퇴');
      console.log('[DEBUG] Is deleted breeder:', isDeleted);
      setIsNotFoundError(!isDeleted);
      setShowDeletedAlert(true);
    }
  }, [profileError]);

  const handleCounselClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    clearCounselFormData();
    router.push(`/counselform?breederId=${breederId}`);
  };

  const handleAlertClose = async () => {
    setShowDeletedAlert(false);

    // 본인 계정이 탈퇴한 경우에만 로그아웃 처리
    if (isOwnProfile && !isNotFoundError) {
      try {
        console.log('[Breeder Profile] 본인 탈퇴 계정 - 로그아웃 처리 시작');

        // 쿠키 삭제 API 호출
        await fetch('/api/auth/clear-cookie', { method: 'POST' });

        // 로컬 스토리지 auth-storage 삭제
        localStorage.removeItem('auth-storage');

        console.log('[Breeder Profile] 탈퇴 계정 로그아웃 처리 완료');
      } catch (error) {
        console.error('[Breeder Profile] 로그아웃 처리 실패:', error);
      }
    }

    // 탐색 페이지로 이동
    router.replace('/explore');
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
      </div>
    );
  }

  // 탈퇴한 브리더 또는 에러 발생 시 모달 표시 + 정상 컴포넌트 렌더링 (모달 보이도록)
  if (profileError) {
    return (
      <>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-body-s text-grayscale-gray5">브리더 정보를 불러오는 중...</p>
        </div>
        <SimpleDialog open={showDeletedAlert} onOpenChange={handleAlertClose}>
          <SimpleDialogContent>
            <SimpleDialogHeader>
              <SimpleDialogTitle className="text-primary">
                {isNotFoundError ? '브리더를 찾을 수 없어요' : '탈퇴한 브리더예요'}
              </SimpleDialogTitle>
              <SimpleDialogDescription className="text-grayscale-gray5">
                {isNotFoundError
                  ? '브리더 정보가 존재하지 않거나\n접근할 수 없어요.'
                  : isOwnProfile
                  ? '탈퇴 처리된 계정이에요.\n다시 로그인해 주세요.'
                  : '이미 탈퇴한 브리더의 프로필은\n조회할 수 없어요.'}
              </SimpleDialogDescription>
            </SimpleDialogHeader>
            <SimpleDialogFooter className="grid-cols-1">
              <Button variant="tertiary" className="w-full" onClick={handleAlertClose}>
                {isOwnProfile ? '확인' : '탐색 페이지로'}
              </Button>
            </SimpleDialogFooter>
          </SimpleDialogContent>
        </SimpleDialog>
      </>
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
  // 비회원은 가격 정보를 볼 수 없음
  const apiPriceRange = (profileData as any)?.priceRange;
  const priceRangeStr = user
    ? apiPriceRange?.min || apiPriceRange?.max
      ? `${apiPriceRange.min?.toLocaleString()} - ${apiPriceRange.max?.toLocaleString()}원`
      : '상담 후 결정'
    : null;

  // API 응답에서 직접 값 추출 (profileImage, location, breederLevel 등)
  const apiData = profileData as any;
  const avatarUrl = apiData?.profileImage || profileData.profileImageFileName || '/profile-empty.svg';
  const locationFromApi = apiData?.location || locationStr;
  const levelFromApi = apiData?.breederLevel === 'elite' ? 'elite' : 'new';

  const breederProfileData = {
    avatarUrl,
    nickname: profileData.breederName,
    level: levelFromApi as 'new' | 'elite',
    location: locationFromApi,
    priceRange: priceRangeStr,
    breeds: (profileData as any)?.breeds || profileInfo?.specializationAreas || [],
    animal: 'dog' as const,
  };

  // 환경 사진 - API 응답 구조에 맞게 처리
  const envPhotos = (profileData as any)?.representativePhotos || profileInfo?.profilePhotos || [];

  // 브리더 소개 - API 응답 구조에 맞게 처리
  const breederDescription = (profileData as any)?.description || profileInfo?.profileDescription || '';

  // 날짜 포맷팅 함수 (YYYY년 MM월 DD일 생 형식)
  const formatBirthDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일 생`;
    } catch {
      return '';
    }
  };

  // 분양 가능 개체 매핑 (비회원은 가격 정보를 볼 수 없음)
  const breedingAnimals = (petsData?.items || []).map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.mainPhoto || '/animal-sample.png',
    name: pet.name,
    sex: pet.gender,
    birth: formatBirthDate(pet.birthDate),
    price: user ? `${pet.price?.toLocaleString() || 0}원` : null,
    breed: pet.breed,
  }));

  // 부모견/부모묘 매핑 - 페이지네이션 응답 형태 처리
  const parentPetsArray = parentPetsData?.items || [];
  const parentPets = parentPetsArray.map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.photoUrl || '/animal-sample.png',
    name: pet.name,
    sex: pet.gender,
    birth: formatBirthDate(pet.birthDate),
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
              <Parents data={parentPets} breederId={breederId} />
              <Separator className="my-12" />
            </>
          )}

          {!isReviewsLoading && reviews.length > 0 && <Reviews data={reviews} />}
        </div>
      </div>
      {!isLg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2  w-full max-w-[22.0625rem]">
          <Button
            variant="counsel"
            className="w-full h-12 rounded-lg text-body-s font-semibold text-primary-500"
            type="button"
            onClick={handleCounselClick}
            disabled={isOwnProfile || isBreeder}
          >
            상담 신청하기
          </Button>
        </div>
      )}
    </>
  );
}
