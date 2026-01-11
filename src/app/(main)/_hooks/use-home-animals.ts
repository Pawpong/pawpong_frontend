'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getAvailablePets, type AvailablePetDto } from '@/lib/home';
import type { HomeAnimalData } from '../_types/home-animal.types';

const PAGE_SIZE = 9;

interface HomeAnimalsResponse {
  data: HomeAnimalData[];
  hasMore: boolean;
}

/**
 * 홈 화면에 표시할 분양 가능한 반려동물 목록을 조회합니다.
 * 백엔드 API: GET /api/home/available-pets
 */
const fetchHomeAnimals = async (): Promise<HomeAnimalsResponse> => {
  try {
    const response = await getAvailablePets(PAGE_SIZE);

    // 백엔드 AvailablePetDto를 프론트엔드 HomeAnimalData 타입으로 변환
    const data: HomeAnimalData[] = response.map((pet: AvailablePetDto) => {
      // birthDate를 "YYYY년 MM월 DD일" 형식으로 변환 (브리더 프로필과 동일한 형식)
      let birthText = '';
      if (pet.birthDate) {
        try {
          const date = new Date(pet.birthDate);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            birthText = `${year}년 ${month}월 ${day}일 생`;
          }
        } catch {
          // 날짜 파싱 실패 시 빈 문자열
        }
      }

      return {
        id: pet.petId, // 고유한 petId 사용 (중복 방지)
        breederId: pet.breederId, // 브리더 프로필 연결용
        avatarUrl: pet.mainPhoto,
        name: pet.name,
        sex: 'male', // 백엔드 API에 성별 정보가 없어 기본값 사용
        birth: birthText,
        price: pet.price !== null ? pet.price.toLocaleString('ko-KR') + '원' : null, // 비로그인 시 null
        breed: pet.breed,
        status: 'available' as const, // 분양 가능 상태
        isAd: pet.isAd ?? false, // 광고 여부
      };
    });

    // available-pets API는 페이지네이션이 없으므로 hasMore는 항상 false
    return {
      data,
      hasMore: false,
    };
  } catch (error) {
    console.error('홈 동물 목록 조회 실패:', error);
    return {
      data: [],
      hasMore: false,
    };
  }
};

export const useHomeAnimals = () => {
  return useInfiniteQuery({
    queryKey: ['home-animals'],
    queryFn: () => fetchHomeAnimals(),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? undefined : undefined), // available-pets API는 페이지네이션이 없음
    initialPageParam: 1,
  });
};
