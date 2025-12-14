import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export interface NoticeItem {
  id: string;
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
  console.log('[공지사항 목록] 요청:', { page, take: PAGE_SIZE });

  const response = await apiClient.get<{
    items: Array<{ announcementId: string; title: string; createdAt: string; content: string }>;
    pagination: { hasNextPage: boolean };
  }>('/api/announcement/list', {
    params: { page, take: PAGE_SIZE },
  });

  console.log('[공지사항 목록] 응답:', response.data);

  const { items, pagination } = response.data;

  const mappedItems: NoticeItem[] = items.map((item) => ({
    id: item.announcementId,
    title: item.title,
    date: item.createdAt,
    content: item.content,
  }));

  console.log('[공지사항 목록] 매핑된 데이터:', mappedItems);
  console.log('[공지사항 목록] hasNextPage:', pagination.hasNextPage);

  return { data: mappedItems, hasMore: pagination.hasNextPage };
};

export function useNotices() {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: ({ pageParam }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
