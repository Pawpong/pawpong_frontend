'use client';

import { use, useState } from 'react';
import { dynamicClient } from '@/utils/dynamic-client';
import Header from '../../_components/header';
import AnimalProfile from '../_components/animal-profile';
import { useBreederProfile, useBreederPetsInfinite, useParentPets } from '../_hooks/use-breeder-detail';
import LoadMoreButton from '@/components/ui/load-more-button';
import { useAuthStore } from '@/stores/auth-store';
import type { PetDetailData } from '../_components/pet-detail-dialog';
import { formatBirthDateToKorean } from '@/utils/date-utils';
import { LoadingText } from '@/components/loading-state';

const PetDetailDialog = dynamicClient(() => import('../_components/pet-detail-dialog'));

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PetsPage({ params }: PageProps) {
  const { id: breederId } = use(params);
  const { user } = useAuthStore();
  const { data: profileData } = useBreederProfile(breederId);
  const {
    data: petsData,
    isLoading: isPetsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBreederPetsInfinite(breederId, 8);
  const { data: parentPetsData } = useParentPets(breederId, 1, 100);
  const [selectedPet, setSelectedPet] = useState<PetDetailData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 분양 가능 개체 매핑 - 모든 페이지의 데이터를 합침
  type Pet = {
    petId: string;
    mainPhoto?: string;
    name: string;
    gender: 'male' | 'female';
    birthDate?: string;
    price?: number;
    breed: string;
    description?: string;
    status?: 'available' | 'reserved' | 'adopted' | string;
  };

  type MappedPet = {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string | null;
    breed: string;
    status?: 'available' | 'reserved' | 'completed';
    description?: string;
  };

  // 모든 페이지의 데이터를 합쳐서 매핑
  const allPets: MappedPet[] =
    petsData?.pages
      .flatMap((page) => page.items || [])
      .map((pet: Pet & { status?: string }) => ({
        id: pet.petId,
        avatarUrl: pet.mainPhoto || '/animal-sample.png',
        name: pet.name,
        sex: pet.gender,
        birth: formatBirthDateToKorean(pet.birthDate),
        price: user ? `${pet.price?.toLocaleString() || 0}원` : null,
        breed: pet.breed,
        status:
          pet.status === 'adopted'
            ? 'completed'
            : ((pet.status || 'available') as 'available' | 'reserved' | 'completed'),
        description: pet.description,
      })) || [];

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

  const handlePetClick = (pet: MappedPet) => {
    // 부모 정보 찾기
    const parents =
      parentPetsData?.items?.map(
        (parent: {
          petId: string;
          photoUrl?: string;
          name: string;
          gender: 'male' | 'female';
          birthDate?: string;
          breed: string;
        }) => ({
          id: parent.petId,
          avatarUrl: parent.photoUrl || '/animal-sample.png',
          name: parent.name,
          sex: parent.gender,
          birth: formatBirthDateToKorean(parent.birthDate),
          breed: parent.breed,
        }),
      ) || [];

    const petDetail: PetDetailData = {
      id: pet.id,
      avatarUrl: pet.avatarUrl,
      name: pet.name,
      sex: pet.sex,
      birth: pet.birth,
      price: pet.price,
      breed: pet.breed,
      status: pet.status || 'available',
      description: pet.description,
      parents: parents,
    };

    setSelectedPet(petDetail);
    setIsDialogOpen(true);
  };

  // 첫 페이지의 총 개수 확인 (더보기 버튼 표시 여부 결정용)
  const firstPageCount = petsData?.pages[0]?.items?.length || 0;

  return (
    <>
      <Header breederNickname={profileData?.breederName || ''} breederId={breederId} hideActions />
      <div className="pt-4 pb-20">
        <div className="flex flex-col items-center gap-10">
          {/* 헤더 */}
          <div className="w-full flex">
            <h1 className="text-heading-3 font-semibold text-primary-500 text-center">분양 중인 아이들</h1>
          </div>

          {/* 콘텐츠 */}
          {isPetsLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingText />
            </div>
          ) : allPets.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">등록된 분양 중인 아이들이 없습니다.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-10 md:gap-[60px] lg:gap-20">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20">
                {allPets.map((pet) => (
                  <AnimalProfile key={pet.id} data={pet} onClick={() => handlePetClick(pet)} />
                ))}
              </div>
              <PetDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                pet={selectedPet}
                type="pet"
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
