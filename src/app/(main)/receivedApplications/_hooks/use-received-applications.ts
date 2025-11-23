import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { receivedApplicationMockData } from "../_mocks/received-application-mock-data";

export interface ReceivedApplicationItem {
  id: string;
  applicantNickname: string;
  animalInfo: string;
  status: "before" | "done";
  applicationDate: string;
}

interface ReceivedApplicationsResponse {
  data: ReceivedApplicationItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const fetchReceivedApplications = async (
  page: number
): Promise<ReceivedApplicationsResponse> => {
  // TODO: API 연동 시 아래 주석 해제
  // const response = await api.get(`/breeder/applications`, {
  //   params: { page, limit: PAGE_SIZE },
  // });
  // return response.data;

  // 목 데이터
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return {
    data: receivedApplicationMockData.slice(startIndex, endIndex),
    hasMore: endIndex < receivedApplicationMockData.length,
  };
};

export function useReceivedApplications() {
  return useInfiniteQuery({
    queryKey: ["received-applications"],
    queryFn: ({ pageParam }) => fetchReceivedApplications(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "before" | "done";
    }) => {
      // TODO: API 연동 시 아래 주석 해제
      // await api.patch(`/breeder/applications/${id}/status`, { status });

      return Promise.resolve({ id, status });
    },
    onSuccess: ({ id, status }) => {
      // 쿼리 캐시 업데이트
      queryClient.setQueryData(
        ["received-applications"],
        (oldData: InfiniteData<ReceivedApplicationsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === id ? { ...item, status } : item
              ),
            })),
          };
        }
      );
    },
  });
}
