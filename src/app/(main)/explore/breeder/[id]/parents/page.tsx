'use client';

import { use } from 'react';
import Header from '../../_components/header';
import AnimalProfile from '../_components/animal-profile';
import { useBreederProfile, useParentPetsInfinite } from '../_hooks/use-breeder-detail';
import { Button } from '@/components/ui/button';
import DownArrow from '@/assets/icons/long-down-arrow.svg';

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

  // 날짜 포맷팅 함수 (브리더 상세 페이지와 동일)
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

  // 부모견/부모묘 매핑 - 모든 페이지의 데이터를 합침
  type ParentPet = {
    petId: string;
    photoUrl?: string;
    name: string;
    gender: 'male' | 'female';
    birthDate?: string;
    breed: string;
  };

  type MappedParentPet = {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string;
    breed: string;
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
        birth: formatBirthDate(pet.birthDate),
        price: '', // 부모견은 가격이 없음
        breed: pet.breed,
      })) || [];

  // 첫 페이지의 총 개수 확인 (더보기 버튼 표시 여부 결정용)
  const firstPageCount = parentPetsData?.pages[0]?.items?.length || 0;

  return (
    <>
      <Header breederNickname={profileData?.breederName || ''} breederId={breederId} hideActions />
      <div className="pt-4 pb-20">
        <div className="flex flex-col items-center gap-10">
          {/* 헤더 */}
          <div className="w-full flex">
            <h1 className="text-heading-3 font-semibold text-primary text-center">엄마 · 아빠</h1>
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
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allParentPets.map((parent) => (
                  <AnimalProfile key={parent.id} data={parent} />
                ))}
              </div>
              {/* 더보기 버튼 - 첫 페이지가 8개 이상이고 다음 페이지가 있을 때만 표시 */}
              {firstPageCount >= 8 && hasNextPage && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-[var(--color-grayscale-gray1)] hover:bg-[var(--color-grayscale-gray2)] h-12 py-2.5 gap-1 rounded-full has-[>svg]:px-0 has-[>svg]:pl-5 has-[>svg]:pr-3 disabled:opacity-50"
                  >
                    <span className="text-body-s font-medium text-grayscale-gray6">
                      {isFetchingNextPage ? '로딩 중...' : '더보기'}
                    </span>
                    <DownArrow />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
