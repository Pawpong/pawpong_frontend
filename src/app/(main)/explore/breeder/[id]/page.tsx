"use client";

import BreederProfile from "@/app/(main)/explore/breeder/[id]/_components/breeder-profile";
import { Separator } from "@/components/ui/separator";
import BreederDescription from "./_components/breeder-description";
import BreedingAnimals from "./_components/breeding-animals";
import EnvPhotos from "./_components/env-photos";
import Parents from "./_components/parents";
import Reviews from "./_components/reviews";
import Header from "../_components/header";
import {
  useBreederProfile,
  useBreederPets,
  useParentPets,
  useBreederReviews,
} from "./_hooks/use-breeder-detail";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const breederId = params.id;

  const { data: profileData, isLoading: isProfileLoading } = useBreederProfile(breederId);
  const { data: petsData, isLoading: isPetsLoading } = useBreederPets(breederId);
  const { data: parentPetsData, isLoading: isParentPetsLoading } = useParentPets(breederId);
  const { data: reviewsData, isLoading: isReviewsLoading } = useBreederReviews(breederId);

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
  const breederProfileData = {
    avatarUrl: profileData.profileImageFileName || "/avatar-sample.png",
    nickname: profileData.breederName,
    level: "elite" as const, // 백엔드 DTO에 level 정보가 없으므로 기본값 사용
    location: `${profileData.profileInfo?.locationInfo?.cityName || ""} ${profileData.profileInfo?.locationInfo?.districtName || ""}`.trim(),
    priceRange: profileData.profileInfo?.priceRangeInfo
      ? `${profileData.profileInfo.priceRangeInfo.minPrice.toLocaleString()} - ${profileData.profileInfo.priceRangeInfo.maxPrice.toLocaleString()}원`
      : "상담 후 결정",
    breeds: profileData.profileInfo?.specializationAreas || [],
  };

  // 환경 사진
  const envPhotos = profileData.profileInfo?.profilePhotos || [];

  // 브리더 소개
  const breederDescription = profileData.profileInfo?.profileDescription || "";

  // 분양 가능 개체 매핑
  const breedingAnimals = (petsData?.items || []).map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.mainPhoto || "/animal-sample.png",
    name: pet.name,
    sex: pet.gender,
    birth: pet.birthDate,
    price: `${pet.price.toLocaleString()}원`,
    breed: pet.breed,
  }));

  // 부모견/부모묘 매핑
  const parentPets = (parentPetsData?.items || []).map((pet: any) => ({
    id: pet.petId,
    avatarUrl: pet.photoUrl || "/animal-sample.png",
    name: pet.name,
    sex: pet.gender,
    birth: pet.birthDate,
    price: "", // 부모견은 가격이 없음
    breed: pet.breed,
  }));

  // 후기 매핑
  const reviews = (reviewsData?.items || []).map((review: any) => ({
    id: review.reviewId,
    nickname: review.adopterNickname || "익명",
    date: new Date(review.createdAt).toISOString().split("T")[0],
    content: review.content,
  }));

  return (
    <>
      <Header breederNickname={profileData.breederName} breederId={breederId} />
      <div className="pt-4 lg:flex lg:gap-24.5 space-y-10 md:space-y-15 pb-10 md:pb-15 lg:lg-80">
        <div>
          <BreederProfile data={breederProfileData} />
        </div>
        <div className="space-y-12">
          {envPhotos.length > 0 && (
            <>
              <EnvPhotos photos={envPhotos} />
              <Separator className="md:my-12" />
            </>
          )}

          {breederDescription && (
            <>
              <BreederDescription data={breederDescription} />
              <Separator className="md:my-12" />
            </>
          )}

          {!isPetsLoading && breedingAnimals.length > 0 && (
            <>
              <BreedingAnimals data={breedingAnimals} />
              <Separator className="md:my-12" />
            </>
          )}

          {!isParentPetsLoading && parentPets.length > 0 && (
            <>
              <Parents data={parentPets} />
              <Separator className="md:my-12" />
            </>
          )}

          {!isReviewsLoading && reviews.length > 0 && <Reviews data={reviews} />}
        </div>
      </div>
    </>
  );
}
