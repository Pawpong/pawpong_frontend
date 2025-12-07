import { useInfiniteQuery } from "@tanstack/react-query";
import { noticeMockData } from "../_mocks/notice-mock-data";

export interface NoticeItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface NoticesResponse {
  data: NoticeItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const fetchNotices = async (page: number): Promise<NoticesResponse> => {
  // TODO: API 연동 시 아래 주석 해제
  // const response = await api.get(`/notices`, {
  //   params: { page, limit: PAGE_SIZE },
  // });
  // return response.data;

  // 목 데이터
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return {
    data: noticeMockData.slice(startIndex, endIndex),
    hasMore: endIndex < noticeMockData.length,
  };
};

export function useNotices() {
  return useInfiniteQuery({
    queryKey: ["notices"],
    queryFn: ({ pageParam }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
}
