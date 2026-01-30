'use client';

import { use, useState } from 'react';
import { dynamicClient } from '@/utils/dynamic-client';
import Header from '../../_components/header';
import AnimalProfile from '../_components/animal-profile';
import { useBreederProfile, useParentPetsInfinite } from '../_hooks/use-breeder-detail';
import LoadMoreButton from '@/components/ui/load-more-button';
import type { PetDetailData } from '../_components/pet-detail-dialog';
import { formatBirthDateToKorean } from '@/utils/date-utils';

const PetDetailDialog = dynamicClient(() => import('../_components/pet-detail-dialog'));

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ParentsPage({ params }: PageProps) {
  const { id: breederId } = use(params);
  const { data: profileData } = useBreederProfile(breederId);
  const {
    data: parentPetsData,
    isLoading: isParentPetsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useParentPetsInfinite(breederId, 8);
  const [selectedPet, setSelectedPet] = useState<PetDetailData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 부모견/부모묘 매핑 - 모든 페이지의 데이터를 합침
  type ParentPet = {
    petId: string;
    photoUrl?: string;
    name: string;
    gender: 'male' | 'female';
    birthDate?: string;
    breed: string;
    description?: string;
    photos?: string[];
  };

  type MappedParentPet = {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string;
    breed: string;
    description?: string;
    photos?: string[];
  };

  // 모든 페이지의 데이터를 합쳐서 매핑
  const allParentPets: MappedParentPet[] =
    parentPetsData?.pages
      .flatMap((page) => page.items || [])
      .map((pet: ParentPet) => ({
        id: pet.petId,
        avatarUrl: pet.photoUrl || '/animal-sample.png',
        name: pet.name,
        sex: pet.gender,
        birth: formatBirthDateToKorean(pet.birthDate),
        price: '', // 부모견은 가격이 없음
        breed: pet.breed,
        description: pet.description,
        photos: pet.photos || [],
      })) || [];

  // 첫 페이지의 총 개수 확인 (더보기 버튼 표시 여부 결정용)
  const firstPageCount = parentPetsData?.pages[0]?.items?.length || 0;

  // 브리더 소개글 가져오기
  type BreederDetailProfileApi = typeof profileData & {
    description?: string;
    profileInfo?: { profileDescription?: string };
  };
  const breederDescription =
    (profileData as BreederDetailProfileApi | undefined)?.description ||
    (profileData as BreederDetailProfileApi | undefined)?.profileInfo?.profileDescription ||
    '';
  const trimmedBreederDescription = breederDescription.trim();

  const handlePetClick = (pet: MappedParentPet) => {
    const petDetail: PetDetailData = {
      id: pet.id,
      avatarUrl: pet.avatarUrl,
      name: pet.name,
      sex: pet.sex,
      birth: pet.birth,
      breed: pet.breed,
      description: pet.description,
      photos: pet.photos || [],
    };

    setSelectedPet(petDetail);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Header breederNickname={profileData?.breederName || ''} breederId={breederId} hideActions />
      <div className="pt-4 pb-20">
        <div className="flex flex-col items-center gap-10">
          {/* 헤더 */}
          <div className="w-full flex">
            <h1 className="text-heading-3 font-semibold text-primary-500 text-center">엄마 · 아빠</h1>
          </div>

          {/* 콘텐츠 */}
          {isParentPetsLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
            </div>
          ) : allParentPets.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">등록된 엄마 · 아빠가 없습니다.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-10 md:gap-[60px] lg:gap-20">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20">
                {allParentPets.map((parent) => (
                  <AnimalProfile key={parent.id} data={parent} onClick={() => handlePetClick(parent)} />
                ))}
              </div>
              <PetDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                pet={selectedPet}
                type="parent"
                breederId={breederId}
                breederDescription={trimmedBreederDescription}
              />
              {/* 더보기 버튼 - 첫 페이지가 8개 이상이고 다음 페이지가 있을 때만 표시 */}
              {firstPageCount >= 8 && hasNextPage && (
                <LoadMoreButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
