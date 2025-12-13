import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import {
  getReceivedApplications,
  updateApplicationStatus as updateApplicationStatusApi,
  type ReceivedApplicationItemDto,
} from '@/lib/breeder-management';

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
    applicantNickname: dto.adopterName,
    animalInfo: dto.petName || '반려동물 정보 없음',
    status: statusMap[dto.status] || 'before',
    applicationDate: new Date(dto.appliedAt).toISOString().split('T')[0],
  };
};

const fetchReceivedApplications = async (page: number): Promise<ReceivedApplicationsResponse> => {
  try {
    const result = await getReceivedApplications(page, PAGE_SIZE);

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
