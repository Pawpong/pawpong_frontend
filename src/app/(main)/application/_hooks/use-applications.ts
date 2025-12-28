import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyApplications, type ApplicationListItemDto } from '@/lib/application';
import { getReceivedApplications, type ReceivedApplicationItemDto } from '@/lib/breeder';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/lib/cookie-utils';

export interface ApplicationItem {
  breederId?: string;
  breederName?: string;
  breederLevel?: 'elite' | 'new';
  applicationDate: string;
  profileImage: string;
  animalType?: 'cat' | 'dog';
  applicationId: string;
  petId?: string;
  petBreed?: string;
  petName?: string;
  /** 입양 원하는 아이 정보 (드롭다운 선택 또는 직접 입력 텍스트) */
  preferredPetInfo?: string;
  adopterId?: string;
  adopterName?: string;
  adopterEmail?: string;
  adopterPhone?: string;
  status: 'consultation_pending' | 'consultation_completed' | 'adoption_approved' | 'adoption_rejected';
}

interface ApplicationsResponse {
  data: ApplicationItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * 입양자용 DTO를 프론트엔드 ApplicationItem으로 변환
 */
const mapAdopterDtoToApplicationItem = (dto: ApplicationListItemDto): ApplicationItem => ({
  applicationId: dto.applicationId,
  breederId: dto.breederId,
  breederName: dto.breederName,
  breederLevel: dto.breederLevel,
  applicationDate: dto.applicationDate,
  // 탐색 화면과 동일하게 API에서 받은 profileImage를 그대로 사용
  profileImage: dto.profileImage || '',
  animalType: dto.animalType,
  petId: dto.petId,
  petBreed: dto.petBreed,
  status: dto.status,
});

/**
 * 브리더용 DTO를 프론트엔드 ApplicationItem으로 변환
 */
const mapBreederDtoToApplicationItem = (dto: ReceivedApplicationItemDto): ApplicationItem => ({
  applicationId: dto.applicationId,
  adopterId: dto.adopterId,
  adopterName: dto.adopterNickname || dto.adopterName, // 닉네임 우선, 없으면 이름
  adopterEmail: dto.adopterEmail,
  adopterPhone: dto.adopterPhone,
  applicationDate: new Date(dto.appliedAt).toLocaleDateString('ko-KR'),
  profileImage: '/profile-empty.svg', // 입양자 프로필 이미지는 나중에 추가
  petId: dto.petId,
  petName: dto.petName,
  preferredPetInfo: dto.preferredPetInfo, // 입양 원하는 아이 정보 (드롭다운 선택 또는 직접 입력)
  status: dto.status,
});

const fetchAdopterApplications = async (page: number, animalType?: 'cat' | 'dog'): Promise<ApplicationsResponse> => {
  const result = await getMyApplications(page, PAGE_SIZE, animalType);

  return {
    data: result.applications.map(mapAdopterDtoToApplicationItem),
    hasMore: result.pagination.hasNextPage,
  };
};

const fetchBreederApplications = async (page: number): Promise<ApplicationsResponse> => {
  const result = await getReceivedApplications(page, PAGE_SIZE);

  return {
    data: result.applications.map(mapBreederDtoToApplicationItem),
    hasMore: result.pagination.hasNextPage,
  };
};

export function useApplications(animalType?: 'cat' | 'dog') {
  const { user } = useAuthStore();
  // 쿠키의 userRole을 우선적으로 사용
  const cookieRole = getUserRoleFromCookie();
  const userRole = cookieRole || user?.role;
  const isBreeder = userRole === 'breeder';

  return useInfiniteQuery({
    queryKey: ['applications', isBreeder ? 'breeder' : 'adopter', animalType],
    queryFn: ({ pageParam }) =>
      isBreeder ? fetchBreederApplications(pageParam) : fetchAdopterApplications(pageParam, animalType),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
