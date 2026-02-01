import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData, useQuery } from '@tanstack/react-query';
import {
  getReceivedApplications,
  updateApplicationStatus as updateApplicationStatusApi,
  getApplicationDetail,
  type ReceivedApplicationItemDto,
  type ReceivedApplicationDetailDto,
} from '@/api/breeder-management';
import { formatDateToISO } from '@/utils/date-utils';

export interface ReceivedApplicationItem {
  id: string;
  applicantNickname: string;
  animalInfo: string;
  status: 'before' | 'done';
  applicationDate: string;
}

interface ReceivedApplicationsResponse {
  data: ReceivedApplicationItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * 백엔드 DTO를 프론트엔드 ReceivedApplicationItem으로 변환
 */
const mapDtoToReceivedApplication = (dto: ReceivedApplicationItemDto): ReceivedApplicationItem => {
  // 백엔드 상태를 프론트엔드 상태로 매핑
  const statusMap: Record<string, 'before' | 'done'> = {
    consultation_pending: 'before',
    consultation_completed: 'done',
    adoption_approved: 'done',
    adoption_rejected: 'done',
  };

  return {
    id: dto.applicationId,
    applicantNickname: dto.adopterNickname || dto.adopterName, // 닉네임 우선, 없으면 이름
    animalInfo:
      dto.petName || dto.preferredPetInfo || dto.standardResponses?.preferredPetDescription || '분양 중인 아이 정보',
    status: statusMap[dto.status] || 'before',
    applicationDate: formatDateToISO(dto.appliedAt),
  };
};

const fetchReceivedApplications = async (page: number): Promise<ReceivedApplicationsResponse> => {
  try {
    const result = await getReceivedApplications(page, PAGE_SIZE);

    // API 응답 확인을 위한 로그
    console.log('[받은 신청] API 응답:', result.applications);

    return {
      data: result.applications.map(mapDtoToReceivedApplication),
      hasMore: result.pagination.hasNextPage,
    };
  } catch (error) {
    console.error('받은 신청 목록 조회 실패:', error);
    return {
      data: [],
      hasMore: false,
    };
  }
};

export function useReceivedApplications() {
  return useInfiniteQuery({
    queryKey: ['received-applications'],
    queryFn: ({ pageParam }) => fetchReceivedApplications(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'before' | 'done' }) => {
      // 프론트엔드 상태를 백엔드 상태로 매핑
      const backendStatus = status === 'before' ? 'consultation_pending' : 'consultation_completed';

      await updateApplicationStatusApi(id, {
        newStatus: backendStatus as any,
      });

      return { id, status };
    },
    onSuccess: ({ id, status }) => {
      // 쿼리 캐시 업데이트
      queryClient.setQueryData(
        ['received-applications'],
        (oldData: InfiniteData<ReceivedApplicationsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((item) => (item.id === id ? { ...item, status } : item)),
            })),
          };
        },
      );
    },
  });
}

export function useApplicationDetail(applicationId: string | null) {
  return useQuery<ReceivedApplicationDetailDto | null>({
    queryKey: ['application-detail', applicationId],
    queryFn: async () => {
      if (!applicationId) return null;
      return await getApplicationDetail(applicationId);
    },
    enabled: !!applicationId,
  });
}
