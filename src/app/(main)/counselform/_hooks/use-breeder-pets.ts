import { useQuery } from '@tanstack/react-query';
import { getBreederPets } from '@/api/breeder';

export interface BreederPetItem {
  petId: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;
  ageInMonths: number;
  price: number;
  status: 'available' | 'reserved' | 'adopted';
  mainPhoto: string;
  photoCount: number;
  isVaccinated: boolean;
  hasMicrochip: boolean;
  availableFrom?: string;
}

interface BreederPetsResponse {
  items: BreederPetItem[];
  statusCounts?: {
    available: number;
    reserved: number;
    adopted: number;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useBreederPets(breederId: string) {
  return useQuery<BreederPetsResponse>({
    queryKey: ['breeder-pets', breederId],
    queryFn: async () => {
      // 분양 가능한 개체만 조회 (status=available)
      const result = await getBreederPets(breederId, 1, 50);
      return result as BreederPetsResponse;
    },
    enabled: !!breederId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
